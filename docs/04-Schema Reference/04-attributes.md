# Attributes

Attributes are used to define additional behaviour to a block. In any given block there will be some allowed attributes. If an attribute is used in a block that doesn’t support it then a validation error will be raised.

## `@unique`

Can be added to a field block to indicate the field has a unique constraint. Only valid for the field types `Text`, `Number`, `Boolean`, `Enum`, `ID`, and `Date`.

```graphql
model Book {
  fields {
    isbn Text @unique
  }
}
```

This attribute can also be used at the model level to create a unique constraint across multiple fields. When doing this the field names are passed as arguments to the attribute.

```graphql
model Book {
  fields {
    firstname Text
    lastname Text
  }

  @unique(firstname, lastname)
}
```

## `@default(expression)`

Can be used inside a field block to provide a default value for that field. The default value provided must match the type of the field.

```graphql
enum UserType {
  USER
  ADMIN
}

model User {
  fields {
    type UserType @default(UserType.USER)
  }
}
```

If no argument is provided then the default value depends on the field type.

| Field Type | Default Value |
| ---------- | ------------- |
| Text       | "”            |
| Number     | 0             |
| Date       | Current date  |
| Timestamp  | Current time  |
| Boolean    | false         |

The argument is an expression which means it can use `ctx` and the parent model.

#### Example using expressions in `@default`

```graphql
model User {
  fields {
    identity Identity {
      @default(ctx.identity)
    }
    firstname Text
    nickname Text {
      @default(user.firstName)
    }
  }
}
```

## `@permission(roles, expression, actions)`

Can be added to a model or action block define a permission rule that determines whether an action is allowed or not for the current Identity. If used at the model level `actions` must be provided, however if used in an action block (whether an operation or a function) then `actions` must not be provided. Both `role`s and `expression` can be provided by only one must pass for the action to be allowed.

`roles` must be a list of `Role` defined in the schema. It is optional if `expression` is provided.

`expression` must be a logical expression. The expression is evaluated at _runtime_ and as access to the current model and the context. See [Expressions](https://www.notion.so/Schema-Reference-2fd7afd4067b428e9ae7e2ee85787ac1) for more info. This argument is optional if `role` is provided.

`actions` must be a list of [action types](https://www.notion.so/Schema-Reference-2fd7afd4067b428e9ae7e2ee85787ac1) that this permission rule should apply to. Only provide this argument if using `@permission` at the model level.

#### Example of permission at model level

```graphql
model Author {
  @permission(
    role: Staff,
    expression: ctx.ipAddress in ["127.0.0.1"],
    actions: [create, get, update]
  )
}
```

#### Example of permission at action level

```graphql
model Post {
  fields {
    author Identity
    title Text
  }
  operations {
    update updatePost(title) {
      @permission(
        expression: post.author == ctx.identity
      )
    }
  }
}
```

## `@where(expression)`

Can be used inside an action definition to provide an implicit filter to the database query. Only valid inside `update`, `get`, and `list` actions. The provided expression must be a binary or logical expression.

```graphql
model Book {
  fields {
    genre Text
  }
  operations {
    list crimeBooks() {
      where(book.genre == "crime")
    }
  }
}
```

## `@set(expression)`

Can be used inside a `create` or `update` action to implicitly set a field on the model being created or updated. The provided expression must be an assignment expression.

```graphql
model Post {
  fields {
    createdBy Identity
    body Text
  }
  operations {
    create createPost(body) {
      @set(post.createdBy = ctx.identity)
    }
  }
}
```

## `@validate(expression)`

Can be used in any operation to provide additional validation. The expression has access to the model(s) being read/written, the inputs, and the context.

```graphql
model Task {
  fields {
    assignedTo Identity?
    startedAt Timestamp?
  }

  operations {
    update assignTask(id, assignedTo)
    update startTask() {
      // cannot start a task if it is not assigned to someone
      @validate(task.assignedTo != null)
      @set(task.startedAt = ctx.timestamp)
    }
  }
}
```
