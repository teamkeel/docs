# Expressions

Expressions can be used as the argument to a number of attributes to provide runtime logic. Expressions always have access to two variables, the current model and the current context.

## Referencing the model

The current model is available in its _lowerCamelCased_ form, so if the model is called `FeaturedPost` then the expression can reference `featuredPost`. Any field on the model can be referenced using dot notation e.g. `modelName.fieldName`.

## Referencing the context

The current context, which in many cases can be thought of as the current request, is available as `ctx`. This object has the following fields:

- `identity` - a reference to the currently authenticated identity (can be null)
- `now` - the current timestamp

## Binary Expressions

A binary expression is an expression that evaluates to a boolean value, for example `A == B` or `A != B`. Supported operators are:

| Operator | Description                                                               | Example    |
| -------- | ------------------------------------------------------------------------- | ---------- |
| ==       | A equals B                                                                | A == B     |
| !=       | A does not equal B                                                        | A != B     |
| >        | A is greater than B                                                       | A > B      |
| >=       | A is greater than or equal to B                                           | A >= B     |
| <        | A is smaller than B                                                       | A < B      |
| <=       | A is smaller than or equal to B                                           | A <= B     |
| in       | B, which is a list of values, contains A, which is a single value         | A in B     |
| not in   | B, which is a list of values, does not contain A, which is a single value | A not in B |

## Logical Expressions

A logical expression is an expression that uses the operators `and` or `or`. Each side of the operator is either a binary expression or another logical expression. The following are all valid logical expressions:

- `A == B or A == C`
- `A != B and A not in C`
- `A in B or (A == C and A != D)`

## Assignment Expressions

An assignment expression is an expression that results in the left-hand side being updated based on the operator and right-hand side. Assignment expressions are only valid when passed to the `@set` attribute inside a `create` or `update` operation. A common use case will be setting a field on a model to the current identity performing the operation or to increment a counter.

```graphql
model Counter {
  fields {
    value Number
    lastIncrementedBy Identity
  }
  operations {
    update updateCounter(id) {
      @set(counter.value += 1)
      @set(counter.lastIncrementedBy = ctx.identity)
    }
  }
}
```

Supported operators for assignment expressions are:

| Operator | Description                 | Example |
| -------- | --------------------------- | ------- |
| =        | Updates A to the value of B | A = B   |
| +=       | Increments A by B           | A += B  |
| -=       | Decrements A by B           | A -= B  |
