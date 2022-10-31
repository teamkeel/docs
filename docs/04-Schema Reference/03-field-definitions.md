# Field Definitions

Fields are defined in the `fields` block inside a model and indicate what data that model contains.

### `fieldName fieldType[modifier] [fieldBody]`

Field definitions start with the name of the field which must be written in lowerCamelCase, followed by the field type.

## Field Names

Field names must be unique with the parent model and written in _lowerCamelCase_. Every model has three built in fields - `id`, `createdAt` and `updatedAt` and so user-defined fields cannot use these names. Field names may only contain the characters `[a-zA-Z0-9]`.

## Field Types

A fields type must be one of the built-in Keel types or another user-defined model (as a relationship). A fields type is allowed to reference it’s parent model to create a self-relationship. For a list of built-in Keel field types see [this page](https://www.notion.so/Field-types-4766712d7c9049fea895a619641dcdbe).

## Repeated and Optional Fields

Field are by default required, meaning they cannot be null. To mark a field as being optional you can add a `?` at the end of the type, for example `Text?` is a text field that can be null.

Fields can also be marked as being repeated by adding `[]` to the end of the type, for example `Text[]` means a list (or array) of text values. Mostly this is useful for relationships between models to denote one-to-many or many-to-many relationships.

## Field Body

Fields can optionally have a “body” (indicated by a pair of curly braces) which can contain attributes that change the behaviour of the field, for example adding a unique constraint.
