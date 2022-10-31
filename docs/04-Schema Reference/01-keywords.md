# Keywords

Keywords are always followed by a set of curly braces which are referred to as a “block”.

## `model <ModelName>`

Used to define a Model in the schema. The model name should be written in _UpperCamelCase_ and must be unique within all models defined in the schema.

```graphql
 model Author {

 }
```

## `fields`

Used to define the fields a Model contains. Only valid inside a `model` block.

```graphql
model Author {
  fields {
    name Text
  }
}
```

## `operations`

Used to define the auto-generated operations a Model has. Only valid inside a `model` block.

```graphql
model Author {
  fields {
    name Text
  }
  operations {
    create createAuthor(name)
  }
}
```

## `functions`

Used to define the custom functions that will be implemented for a Model. Only valid inside a `model` block.

```graphql
model Author {
  fields {
    name Text
  }
  functions {
    create createAuthor(name)
  }
}
```

## `api <ApiName>`

Used to define an API that the generated Keel application should expose. The API name should be written in UpperCamelCase and be unique within all API’s defined in the schema.

### `models`

Used to define which Models should be included in an API. Only valid inside an `api` block.

```graphql
api Web {
  models {
    Author
    Book
  }
}
```

## `role <RoleName>`

Used to define a role in the schema. The role name must be written in _UpperCamelCase_ and must be unique within all roles defined in the schema. Role names are used in `@permission` rules.

### `domains`

Used to define a list of domains that if matched against the current Identities email address should result in the Role being applied. Each domain must wrapped in double quotes to indicate it is a literal.

```graphql
role Staff {
  domains {
    "myorg.com"
    "anotherorg.com"
  }
}
```

### `emails`

Used to define a set of email addresses that if matched against the current Identities email address should result in the Role being applied. Each email must wrapped in double quotes to indicate it is a literal.

```graphql
role Admin {
  emails {
    "harry@myorg.com"
    "sarah@myorg.com"
  }
}
```
