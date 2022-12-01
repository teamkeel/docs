# Relationships

When a field uses another model as its type that creates a relationship being the two models. The type of relationship depends on whether the fields are marked as repeated on each side.

| Model A            | Model B      | Relationship Type (from perspective of Model A) |
| ------------------ | ------------ | ----------------------------------------------- |
| ModelB[]           | No reference | Invalid                                         |
| ModelB[]           | ModelA       | One-to-many                                     |
| ModelB[]           | ModelA[]     | Many-to-many                                    |
| ModelB { @unique } | No reference | One-to-one                                      |
| ModelB             | No reference | Many-to-one                                     |
| ModelB             | ModelA       | Invalid                                         |
| ModelB             | ModelA[]     | One-to-many                                     |

Models can reference one another via standard relational concepts such as has_one, has_many, belongs_to.

#### Example of has_many / belongs_to:

```graphql
model Post {
  fields {
    title Text
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

Note that the `posts Post[]` field on `Author` can be omitted entirely for the above relationship to still be valid. However, the "many" side (i.e. `author Author` on `Post`) is always required in such a relationship.

#### Example of many to many relationship

```graphql
model Project {
  fields {
    title Text
    author Author
    assignments ProjectAssignment[]
  }
}

@join_table
model ProjectAssignment {
  fields {
    project Project
    employee Employee
  }
}

model Employee {
  fields {
    firstName Text
    lastName Text
    assignments ProjectAssignment[]
  }
}
```
