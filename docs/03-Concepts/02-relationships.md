
# Relationships

Relationships are a key component of data modelling and also a first-class feature in the Keel schema language.  Models can relate to one another in various ways; one-to-many, many-to-one, one-to-one and many-to-many relationships.  The sections that follow will explore how to model these in the Keel schema and how related data can be created and queried.

## Modelling a relationship

As described in the previous section, a relationship is defined using a model as a field type.  For example, in the schema below, the `author Author` field definition on the `Book` model describes an association of that model to an `Author` - i.e. a book _belongs to_ an author, which is a many-to-one relationship.

```graphql
model Book {
  fields {
    title Text
    isActive Boolean
    author Author
  }
}

model Author {
  fields {
    name Text
    posts Post[]
  }
}
```

Furthermore, the `posts Post[]` field on `Author` tells us that an author can have many books.  We know this because it is a repeated field - i.e. it is defined with square brackets (`[]`).  Note that this side of the relationship is not strictly necessary in order for the many-to-one relationship to exist.

## Filtering by related data

Related models and their fields can be referenced in short-form inputs and in expressions using the dot notation.  Continuing from the same example, the `listBooksByAuthor(book.author.name)` operation below provides searching for all books by author name.  


```graphql
model Book {
  fields {
    title Text
    isActive Boolean
    author Author
  }

  operations {
    list listBooksByAuthor(book.author.name)
  }
}

model Author {
  fields {
    name Text
    posts Post[]
  }

  operations {
    list listActiveAuthors() {
      @where(author.books.isActive)
    }
  }
}
```

Furthermore, the `listActiveAuthors` operation demonstrates how relationships can also be used in expressions.  This operation will retrieve all authors who have an active book.

### Creating related data

A `Book` requires an `Author`.  We know this because the `author` field is not optional. This means that when creating a new `Book` instance will require associated `Author`. This is done by providing the unique `id` identifier of the `Author` as an input at the time of creation.  The operation looks like this:

```graphql
model Book {
  fields {
    title Text
    isActive Boolean
    author Author
  }

  operations {
    create createBook(title, author.id)
  }
}
```

Note that `author.id` and `authorId` can be used interchangeably as they both reference the same underlying field.

### Full Example

Below is an extended and more complete example.

```graphql
model Book {
  fields {
    title Text
    isActive Boolean
    author Author
  }

  operations {
    create createBook(title, isActive, author.id)

    get getBook(id)

    list listBooksByAuthor(book.author.name)

    list listBooksByPenguin()
  }

  @permission(
    actions: [create, get, list],
    expression: ctx.isAuthenticated
  )
}

model Author {
  fields {
    name Text
    posts Post[]
    publisher Publisher?
  }

  operations {
    create createAuthor(name, publisher.id?)

    update updateAuthorWithNewPublisher(id) with (publisher.id)

    update updateAuthorWithNoPublisher(id) {
       @set(author.publisherId = null)
    }

    list listActiveAuthors() {
      @where(author.books.isActive)
    }
  }

  @permission(
    actions: [create, update, list],
    expression: ctx.isAuthenticated
  )
}

model Publisher {
  fields {
    name Text
    authors Author[]
  }

  operations {
    create createPublisher(name)

    list listActivePublishers() {
      @where(publisher.authors.books.isActive)
    }
  }

  @permission(
    actions: [create, list],
    expression: ctx.isAuthenticated
  )
}
```