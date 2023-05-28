# Permissions

Keel takes a **secure by default** approach, which means that unless you explicitly define permission rules all your actions will return permission denied errors. Keel supports both row-based and role-based permission rules at the model or individual action level.

A role-based permission rule allows anyone who has one of the given role to perform any of the specified action types.

```keel {2-5}
model MyModel {
  @permission(
    roles: [Staff],
    actions: [get, create, update, delete],
  )
}
```

A row-based permission rule is based on the data being acted on and uses an expression to determine if the action is allowed.

```keel {2-5}
model MyModel {
  @permission(
    expression: post.author.identity == ctx.identity,
    actions: [update],
  )
}
```

## `@permission` attribute

The `@permission` attribute can be used at model or action level and can be used to define row-based or role-based permission rules. It accepts three arguments: **actions**, **expression**, and **roles**.

The `expression` argument is for defining row-based permissions, and the provided expression is evaluated against against **each record being acted on**.

The `roles` argument is for role-based permissions and lets you define a list of role names that the rule should allow. The caller must have **one of the provided roles**.

The `actions` argument must be provided when the rule is defined at the model level, and is a list of action types that the rule should apply to. For action level permission rules this argument must be omitted.

Some key things to understand are:

- There can be **many** permission rules in a model or action
- Action-level rules **override** model-level rules
- If **any** permission rule passes the action is allowed

### Expressions

If provided the `expression` argument is evaluated for each record being acted upon, and has the following in-scope identifiers:

- the record, available as the **lowerCamelCase** version of the model name
- `ctx` - contains things like the authenticated identity, environment variables & secrets
- any enums defined in your schema

If the expression evaluates to true for **all records** being acted on then the rule passes.

### Roles

Roles are defined in your schema and are applied to the **authenticated Identity** based on either a specific email address or an email domain name. For example the following schema says that anyone with a `@mycorp.com` email address has the `Staff` role but only `bob@mycorp.com` and `sue@mycorp.com` have the `Developer` role.

```keel
role Staff {
  domains {
    "mycorp.com"
  }
}

role Developer {
  emails {
    "bob@mycorp.com"
    "sue@mycorp.com"
  }
}
```

You can then use these role names in permission rules. As an example the following schema allows anyone with the `Staff` role to update an order.

```keel {10-13}
model Order {
  fields {
    status Text
  }

  operations {
    update updateOrder(id) with (status)
  }

  @permission(
    roles: [Staff],
    actions: [update],
  )
}
```

## Public access

You can make a permission rule that will always pass by using the expression `true`. The following schema allows public access to all actions in the `Post` model.

```keel {11-14}
model Post {
  operations {
    get getPost(id)
    list listPosts(createdAt)
  }

  functions {
    create newPost() with (title)
  }

  @permission(
    expression: true,
    actions: [get, list, create],
  )
}
```

You can use the same approach to make a specific action public. For example the following schema makes the `getPost` action public.

```keel {4}
model Post {
  operations {
    get getPost(id) {
      @permission(expression: true)
    }
  }
}
```

## Using Identity

A common permissions pattern is to only allow the owner/creator of some data to modify it. The following schema lets any authenticated user create posts, but only the author of a post can edit or publish a post.

```keel {5,10-11,19-23,25-29}
model Post {
  fields {
    body Text
    publishedAt Timestamp?
    author Identity
  }

  operations {
    create createPost() with (body) {
      // set the author to the authenticated Identity
      @set(post.author = ctx.identity)
    }
    update editPost(id) with (body)
    update publishPost(id) {
      @set(post.publishedAt = ctx.now)
    }
  }

  // Any authenticated user can create
  @permission(
    expression: ctx.isAuthenticated,
    actions: [create],
  )

  // Only the author of a post can update
  @permission(
    expression: post.author == ctx.identity,
    actions: [update],
  )
}
```

### Relationships

You’ll generally only add an `Identity` field to the model that represents users in your app, which means that you’ll often write permission rules that need to traverse your data model. Luckily this is very easy to do with expressions.

Imagine you’re building a project management app which has users, projects, and tasks. Users can create projects and tasks can be added to projects. You only want the owner of a project to be able to update a task. To do this we just need to write a permission rule in the `Task` model that joins to the `User` and checks the `identity` field against the authenticated Identity calling the action.

```keel {18-21}
model User {
  fields {
    identity Identity @unique
  }
}

model Project {
  fields {
    user User
  }
}

model Task {
  fields {
    project Project
  }

  @permission(
    expression: task.project.user.identity == ctx.identity,
    actions: [update],
  )
}
```

### Many-to-many Relationships

In the previous example we saw how we can implement permission rules based on the owner (or creator) of some data, but what if we want to allow many people permission to edit some data. To illustrate this let’s extend our project management app to allow for collaboration between users. Now many users can access a project and anyone with access to a project can create tasks in it.

```keel {26-30}
model User {
    fields {
        identity Identity
        projects UserProject[]
    }
}

model Project {
    fields {
        users UserProject[]
    }
}

model UserProject {
    fields {
        user User
        project Project
    }
}

model Task {
    fields {
        project Project
    }

    // allow any user with access to the project to create a Task
    @permission(
        expression: ctx.identity in task.project.users.user.identity,
        actions: [create]
    )
}
```

This schema has a many-to-many relationship between users and projects, represented by the `UserProject` model, and so the expression `task.project.users.user.identity` does the following:

- Starting at the `Task` record (in this case the one being created), go to the parent `Project`
- From the `Project` go to the list of `UserProject`'s
- From **each** `UserProject` go to the `User`
- From **each** `User` get the `identity` field

The important thing here is the **“for each”** part of the last two steps. Because a project has many users we ultimately end up with a **list of Identity’s**. This means we can’t compare `ctx.identity` to `task.project.users.user.identity` with `==` as they are different types. For this case we need to use the `in` operator to say that the authenticated Identity must be in the list of Identity’s with access to the project.

## Functions

For all actions types other than `read` and `write` you don’t need to do anything special in your function for permissions to work. For example the following schema has a function called `completeTask` that can only be performed by the person assigned to that task.

```keel {9-11} filename="schema.keel"
model Task {
  fields {
    assignedTo Identity? @unique
    completedAt Timestamp?
  }

  functions {
    update completeTask(id) {
      @permission(
        expression: task.assignedTo == ctx.identity
      )
    }
  }
}
```

The function code doesn’t need to contain any specific permissions code.

```tsx filename="functions/completeTask.ts"
import { CompleteTask } from "@teamkeel/sdk";

export default CompletetTask(async (input, api, ctx) => {
  const where = {
    assignedTo: ctx.identity.id,
  };

  const values = {
    completedAt: ctx.now(),
  };

  return api.models.task.update(where, values);
});
```

This works because your function is run inside a database transaction which is rolled back if no permission rule passes against the record(s) returned by your function.

### Custom Functions

For `read` and `write` functions you need to implement permissions inside your function. This is done by calling one of the two following methods:

- `api.permissions.allow()`
- `api.permissions.deny()`

When you call `api.permissions.allow()` the function is marked as having permission allowed, and the database transaction your functions runs in will be committed.

If you call `api.permissions.deny()` then your function will stop executing and the database transaction will be rolled back, and the caller of your function will get a permission denied error.
