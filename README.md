# Next.js, GraphQL, Apollo Client and Auth0 starter application

## Prerequisites

- Auth0 account.
- A GraphQL api needing an auth token for authentification.

## Initial setup

#### Install dependencies

```
$ yarn
```

#### Adjust variables in .env file

#### Setup `.env.local` file

Copy `.env.local.example` to a file called `.env.local.example` and fill out the variables accordingly.

Hint: `SESSION_COOKIE_SECRET` should be a very long and randomly generated string.

#### Adjust `lib/checkLoggedIn.js`.

This function determines wheter or not a user is properly logged in and able to access the backend api by makeing a _request to get the user info_.
This request might differ depending on your api.
Adjust it to the graphql query that will best determin if your user is logged in or not.

#### Start application

```
$ yarn dev
```
