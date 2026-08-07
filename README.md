# Fetching and setting state with React

<!-- [![Known Vulnerabilities](https://snyk.io/test/github/alpersonalwebsite/react-state-fetch/badge.svg)](https://snyk.io/test/github/alpersonalwebsite/react-state-fetch) -->
[![CircleCI](https://circleci.com/gh/alpersonalwebsite/react-state-fetch.svg?style=shield)](https://circleci.com/gh/alpersonalwebsite/react-state-fetch)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

An easy, basic and raw (no styles attached) example of **HOW to** `fetch` data and put
it in local state, done three ways so you can compare them.

| Container | Approach |
| --- | --- |
| `src/containers/RegularWay.js` | class component, `componentDidMount` + `this.setState` |
| `src/containers/HooksWay.js` | function component, `useState` + `useEffect` inline |
| `src/containers/CustomHookWay.js` | the same logic extracted into `src/hooks/useFetch.js` |

All three render through the same `src/components/UserList.js`, on purpose: the three
ways should differ only in **how they fetch**, so sharing the renderer keeps the
comparison honest.

Read them in that order. The interesting step is the third: notice that
`CustomHookWay` has no fetch, no error handling and no loading flag of its own, and
that `useFetch` is now usable by anything.

## The two bugs this repo used to have

Both are worth knowing, because both are easy to write and neither announces itself.

**`key={uuid.v4()}`.** Every row was keyed with a freshly generated uuid. A key is
React's promise that "this element is the same one as last time", and a new key every
render breaks that promise every render, so React unmounts each row and mounts a
replacement instead of updating it. You lose DOM state (focus, selection, scroll
position, uncommitted input) and any state inside the row, and an O(changed) update
becomes O(all). Measured with a mount counter over two renders of an unchanged
three-row list:

| key | mounts |
| --- | --- |
| `uuid.v4()` | 6 |
| `user.id` | 3 |

A key must be **stable and derived from the data**. An `id` already is one; a uuid
generated at render time is the opposite of one.

**`useFetch` could not refetch.** Its dependency array was `[]` while the body closed
over `URI`, so the effect ran once and ignored every later URL. A custom fetch hook
that cannot fetch a second URL is most of the hook missing. Create React App had been
reporting it on every build:

```
React Hook useEffect has a missing dependency: 'URI'   react-hooks/exhaustive-deps
```

and `CI: false` in `.circleci/config.yml` is exactly what stopped anyone seeing it,
since Create React App only treats warnings as errors when `CI` is set. That setting
is gone.

`useFetch` also cancels now: its cleanup sets a flag so a slower earlier request cannot
overwrite a faster later one, and so nothing calls `setState` after unmount.

## `fetch` does not reject on 404

Worth stating on its own, because it surprises people. `fetch` only rejects on a
network-level failure. A 404 or a 500 is a perfectly successful promise with `ok:
false`, so the old code passed the dead endpoint's **HTML error page** straight into
`res.json()` and the user saw a JSON parse error rather than a 404. `jsonOrThrow`
checks `res.ok` first.

## Pointing it at an API

`REACT_APP_API_URL`, defaulting to `http://localhost:3333/api/users`, which is
[node-express-postgresql](https://github.com/alpersonalwebsite/node-express-postgresql)
running locally. That is the project the original hardcoded endpoint
(`node-express-postgre.herokuapp.com`) was serving, before Heroku retired its free
dynos and the host started answering `404 No such app`.

```shell
cp .env.example .env      # then edit it, .env is gitignored
```

Only variables prefixed `REACT_APP_` reach the bundle, and Create React App **inlines
them at build time**, so whatever you put there ends up in `build/static/js/*.js`. An
endpoint URL is fine. A key or a token is not.

Remember to enable CORS on whatever you point this at, including a `localhost` on a
different port. The backend above already does.

`readUsers` accepts both a bare array and a `{ "data": [ ... ] }` wrapper, but the
field names are not negotiable: `UserList` renders `firstname` and `lastname` and keys
on `id`, matching that backend.

## Installation

```shell
npm ci
```

## Running the dev server

```shell
npm start
```

## Tests, lint and format

```shell
npm test
npm run lint
npm run format
```

## Building

```shell
npm run build
```

**On Node 17 or newer this fails** with `ERR_OSSL_EVP_UNSUPPORTED`. That is webpack 4
(via `react-scripts` 3) using an MD4 hash that OpenSSL 3 no longer provides, not a
problem with this code. The dependencies here are deliberately left at their versions,
so pass the flag instead:

```shell
NODE_OPTIONS=--openssl-legacy-provider npm run build
```
