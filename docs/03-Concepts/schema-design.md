---
sidebar_position: 2
---

# Schema design

> The Keel schema is a custom DSL (Domain Specific Language) for describing a Keel application. This includes but is not limited to data models, operations that can be taken on those models, and permission rules that specify who is allowed to perform those operations.

## Principles

For designing our own schema we have two design goals:

- Use syntax that is likely to feel familiar
- Keep the syntax as simple as possible

## Models

A schema starts by defining some models.

```graphql
model Author {

}
```

We’ll start by just defining a single model, in this case `Author`. We use the `model` keyword to indicate we’re defining a model and then the name of the model. After that we open a “block” using curly brackets.

### Fields

Fields define the data stored within a model.

```graphql
model Author {
  fields {
    name Text
    books Book[]
  }
}
```

To define our fields we used the `fields` keyword followed by another block. Inside the fields block we define our actual fields, which again uses syntax that for now looks like Prisma. The reason we’ve nested our fields inside a `fields` block rather than just putting them straight into the model is because later we’ll be adding _other_ things to the model that are not fields.

All models implicitly have some fields added by default - an `id` which is a UUID and is the primary key, and `createdAt` and `updatedAt` fields which are both timestamps and work as you would expect them to. So actually this model has five fields, the two defined in the schema plus the three added automatically by Keel.

`Text` is one of the built-in Keel types and just stores plain text of any length, but `Book` is a reference to another model so let’s add that definition too.

```graphql
model Author {
  fields {
    name Text
    books Book[]
  }
}

model Book {
  fields {
    title Text
    authors Author[]
  }
}
```

Now that we have the definition for `Book` we can see that the relationship between `Author` and `Book` is _many-to-many_. This is because authors can write many books, and books and be written by many authors. If book had defined the `authors` field with the type `Author` then the relationship type would have been _one-to-many_.

So far we have enough to create a database schema, but that is all. The next thing we need to define are the _operations_ we can take on our models.

## Operations

Operations describe things that can be _done_ with or to a model and could be thought of in the same way as GraphQL queries or mutations. The key thing about operations is that they are implemented by Keel based on the schema and require **no additional code to be written**.

```graphql
model Author {
  fields {
    name Text
    books Book[]
  }
  operations {
    create createAuthor() with (name)
    get author(id)
  }
}

model Book {
  fields {
    title Text
    authors Author[]
  }
  operations {
    create createBook() with (title, authors)
    get book(id)
  }
}
```

Operations are defined in a block that uses the `operations` keyword. Inside the operations block we declare each operation by using a keyword that describes the type of the operation e.g. `create`, `get`, `list`, `update`, or `delete`. It’s very possible we will have more operation types in the future, for example `search` or `subscribe`.

After this keyword we define the operation in a similar way to GraphQL but with a big difference being we don’t need to provide the types of each argument. We don’t need to do this because **operations are scoped to a model**, and the input types are inferred from the field named.

For `create` and `update` operations the fields listed as inputs are **set as part of the operation**, so for `createAuthor` we let the caller of the API provide the `name` field which will get set on the newly created `Author`.

For `get` operations the provided fields must correspond to a **unique lookup on the model**, as `get` will always return a single record. As such, if the operation was defined as accepting `name` instead of `id` that would cause an error that explained to the user that `name` is not a unique field and so can’t be used as a lookup for a get query.

If we did happen to have other unique fields on a model then we could lookup by those instead. So for example if `Book` had an `isbn` field which was marked as unique we could add a `bookByIsbn` operation.

```graphql
model Book {
  fields {
    title Text
    isbn Text @unique
    authors Author[]
  }
  operations {
    create createBook() with (title, authors)
    get book(id)
    get bookByIsbn(isbn)
  }
}
```

## Functions

Operations are great because they require no code to be written and will likely cover a lot of use-cases, but there will always be a need for _some_ custom code, for example if you need to call out to a third party service or implement some specific business logic. For these cases you can define **functions** on your models. From a schema point of view, they look identical to operations, except they live in their own block named `functions`.

For example this schema defines a custom function on `Book`.

```graphql
model Book {
  fields {
    title Text
    isbn Text {
      @unique
    }
    authors Author[]
  }
  functions {
    get getRandomBook()
  }
}
```

When a function like this is defined in the schema we will expect a corresponding TypeScript function to exist in a specific place on the filesystem that that has the following signature:

```graphql
async function getRandomBook(ctx: Context): Promise<Book>
```

Filesystem naming conventions are still to be worked out but an idea would something like `models/book/functions/getRandomBook.ts`. What you put in this function is up to you, as long as it returns a single `Book` record. For interacting with the database we would provide a type-safe ORM or similar that understands your data model and also applies all the relevant validation rules before writes.

Our goal will be to do **everything we can at build time to try and validate the function** has been implemented correctly, for example by performing static analysis on the code to make sure it’s valid.

## Permissions

So far we’ve specified some models and some operations that can be taken on those models, but we haven’t specified _who_ is allowed to perform those operations. Because we want to be secure by default as it stands no-one can perform these operations, so let’s change that.

Keel supports two types of permission rules, Row-Based-Access-Control and Role-Based-Access-Control. The former requires inspecting the _row_ trying to be read/written and determining whether the action is allowed. The latter works by assigning _roles to identities_ and then specifying what actions that role is allowed to take.

### Row Based Access Control

```graphql
model Author {
  fields {
    createdBy Identity
    name Text
    books Book[]
  }

  operations {
    create createAuthor() with (name)
    get author(id)
  }

  @permission(
    expression: ctx.identity == author.createdBy,
    actions: [get]
  )
}
```

Here we’ve added a `@permission` attribute to the model itself. This also shows how attributes can accept _arguments_. The syntax for attribute arguments is similar to Python and Swift where arguments can be named. In this case we’re passing the `expression` argument and the `actions` argument. When passing named arguments the order does not matter.

We’ve added a new field to the model called `createdBy` which is of type `Identity`. `Identity` is a built-in Keel type that is used for authentication.

The `expression` argument is executed at _runtime_ for _each_ _instance_ of the model. If the expression evaluates to true then the actions defined in the `actions` argument are allowed. Inside the expression there are always two in-scope variables - `ctx` and the current model (lowerCamelCased to denote an _instance_ of that model and not the model itself), in this case the model is `Author` and so the current instance is called `author`. `ctx` is short for context and will contain some information about the current request, for example `ctx.identity` is the authenticated identity making the request.

Putting this all together we can see that if the identity making the request is the same identity that created the Author then they are allowed to read it.

Permission attributes can live at the model level, or they can be added to specific operations. When added directly to operations the `actions` argument is not required (in fact it would be an error to provide it).

```graphql
model Author {
  fields {
    createdBy Identity
  }

  operations {
    get author(id) {
      @permission(
        expression: ctx.identity == author.identity
      )
    }
  }
}
```

### Role Based Access Control

We assign roles to identities using a top-level `role` block in the schema.

```graphql
role Staff {
  emails {
    "@myorg.com"
  }
}

role Admin {
  emails {
    "sarah@myorg.com"
    "harry@myorg.com"
  }
}
```

Here we’ve defined two roles - `Staff` and `Admin`. The `Staff` role is applied to any identity with an email address ending in `@myorg.com` whereas the `Admin` role is only applied to two specific people - Sarah and Harry.

We can now use these roles in a `@permission` attribute inside a model. For example here we say that anyone with the `Staff` role can read an Author but only identities with the `Admin` role can create an Author.

```graphql
model Author {
  fields {
    name Text
    books Book[]
  }

  operations {
    create createAuthor() with (name)
    get author(id)
  }

  @permission(
    role: Staff
    actions: [get]
  )

  @permission(
    role: Admin
    actions: [create]
  )
}
```

Row-Based and Role-Based access control can be used together in a model to create complex permission rules that allow for both use-cases.

## API’s

Although we’ve defined models, operations, and permission rules, we haven’t yet actually defined any API’s. To define an API we need to add a new section to our schema.

```graphql
api Web {
  @graphql

  models {
    Author
    Book
  }
}
```

This new section starts with the `api` keyword, followed by the logical name of the API which is this case is “Web”. After that we open a block and inside that block define the API.

First we say what _kind_ of API we want, in this case GraphQL. The other likely API type we will support is `@rpc`, which would give you a JSON RPC API.

The other thing we define in our API is which models we want to include. As an application grows it is likely there will be models that are only for internal use and wouldn’t want to be exposed to an API used to build a customer-facing website or mobile app. It might be possible to go further here and specify specific fields or operations to include or exclude, but that is not covered in this document.

## Full Example

Here is a full working example based on what’s been discussed in this doc. This would be a deployable schema that would create two database tables and provide a GraphQL API. In this example there is **no custom code required at all**, it’s all generated by Keel.

```graphql
model Author {
  fields {
    name Text
    books Book[]
  }

  operations {
    create createAuthor() with (name)
		update updateAuthor(id) with (name)
    get author(id)
  }

  @permission(
    actions: [get],
    expression: true
  )

  @permission(
    role: Admin
    actions: [create, update],
    expression: author.owner = ctx.identity
  )
}

model Book {
  fields {
    title Text
    isbn Text {
      @unique
    }
    authors Author[]
  }

  operations {
    create createBook() with (title, authors)
    get book(id)
    get bookByIsbn(isbn)
  }

  @permission(
    actions: [get],
    expression: true
  )

  @permission(
    actions: [create],
    role: Admin
  )
}

role Admin {
  emails {
		"myorg.com"
  }
}

api Web {
  @graphql

  models {
    Author
    Book
  }
}
```
