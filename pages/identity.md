# Identity & Authentication

Almost every application requires authentication and for this purpose Keel comes with a built-in `Identity` model. This model represents the different **identities** that have **authenticated** with your app and includes a few actions that can be used to build authentication into your product.

## `Identity` model

The `Identity` model is built-in to all Keel schemas and looks like this.

```keel
model Identity {
  fields {
    email Text? @unique
    password Password?
  }
  functions {
    write authenticate(AuthenticateInput) returns (AuthenticateResponse)
    write requestPasswordReset(RequestPasswordResetInput) returns (RequestPasswordResetResponse)
    write resetPassword(ResetPasswordInput) returns (ResetPasswordResponse)
  }
}
```

This is a standard Keel model and so includes the usual built-in model fields `id`, `createdAt`, and `updatedAt`. Keel provides implementations for all the functions defined in this model, which are explained in more detail later on.

Since `Identity` is a standard model, you can use it as a relationship field. A likely use-case for this is to add `Identity` to the model that represents **users** in your application. For instance, you might add `Identity` to a `Customer` model.

```keel
model Customer {
  fields {
    identity Identity @unique
  }
}
```

When using `Identity` like this you will almost definitely want to **mark the field as unique**, so that an identity relates to a single customer.

## Using `ctx.identity`

When writing an expression in your schema or writing a function, `ctx.identity` refers to the currently **authenticated** `Identity`. If the caller of an action is not authenticated then `ctx.identity` will be null.

### Filtering records by Identity

It is common to want to make API’s that only return data owned by the caller. This can be done in a Keel app by filtering the returned records by the authenticated `Identity`. As an example in the following schema there is a `myPosts` action that only returns the posts created by a profile that is linked to the calling Identity.

```keel
model Profile {
  fields {
    identity Identity @unique
    posts Post[]
  }
}

model Post {
  fields {
    profile Profile
  }
  operations {
    list myPosts() {
      @where(post.profile.identity == ctx.identity)
    }
  }
}
```

Note that filtering records like this is different to defining [**permissions**](/permissions).

### Setting a field to the callers Identity

When `Identity` is used in a model as a relationship field you’ll always want to use `ctx.identity` to set it, rather than trying to accept it as an input (which won’t work).

```keel
model Profile {
  fields {
    identity Identity @unique
  }
  operations {
    create createProfile() {
      @set(profile.identity = ctx.identity)
    }
  }
}
```

### Usage in functions

In functions `ctx.identity` is either an `Identity` record or `null`. You can use this object to check if the caller is authenticated or to set a field of another model.

```ts
export default function MyFunction(async (inputs, api, ctx) => {
  if (!ctx.identity) {
    // Calling deny() your function will stop execution and
    // result in the caller getting a Permission Denied error
    api.permissions.deny();
  }

  return api.models.profile.create({
    identityId: ctx.identity.id,
  });
});
```

## Authentication actions

As shown earlier, the `Identity` model defines three Actions that you can use to manage authentication in your app. For more detailed information on how to use authentication see the [API docs](/apis).

### `authenticate`

The `authenticate` action is used to obtain an access token that can be used to make authenticated requests to your API’s. You can use this Action to implement a sign-up/sign-in form in your application. For more information on making authenticated requests to your API’s see the [API docs](/apis).

Note that in Keel authenticating has nothing to do with how you manage users in your application, and so it’s up to you to decide whether you have customers, profiles, accounts, or some other way of describing your users. All `authenticate` does is give you a way of _identifying_ the caller of an Action.

```keel filename="authenticate message definitions"
// input message
message AuthenticateInput {
  // if true then a new identity will be created if it
  // does not already exist
  createIfNotExists Boolean

  // details for email/password authentication
  emailPassword AuthenticateEmailPasswordInput
}

message AuthenticateEmailPasswordInput {
  email Text
  password Text
}

// response message
message AuthenticateResponse {
  // true if a new Identity was created
  identityCreated Boolean

  // A signed JWT token that can be used to make authenticated
  // requests to your API's
  token Text
}
```

### `requestPasswordReset`

This action will trigger an email to be sent with a link to reset a password. You provide the users email and the URL for the link. Keel will add a `token` query parameter to the URL which you can then use with the `resetPassword` action to reset the password.

```keel filename="requestPasswordReset message definitions"
message RequestPasswordResetInput {
  // The email address of the Identity to reset the password for
  email Text

  // The URL to use in the reset password email. A token parameter
  // will be added to this URL which can be passed to the resetPassword
  // action
  redirectUrl Text
}
```

### `resetPassword`

This action can be used after a user clicks on the link in a reset password email. It accepts a token, which will have been added to the redirect URL, and the new password.

```keel filename="resetPassword message definitions"
message ResetPasswordInput {
  // The token that was appended to the reset password link sent by
  // the resetPasswordReset action
  token Text

  // The new password
  password Text
}
```
