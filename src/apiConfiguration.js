// The API used to be hardcoded to https://node-express-postgre.herokuapp.com/users,
// which no longer exists: Heroku retired its free dynos and that host now answers 404
// with "No such app". A demo about fetching data pointed at nothing.
//
// Create React App exposes only REACT_APP_-prefixed variables to the bundle, and it
// inlines them at BUILD time, so a value here ends up in build/static/js/*.js in plain
// sight. Fine for an endpoint, not for a key or a token.
//
// The default is the local API from
// https://github.com/alpersonalwebsite/node-express-postgresql, the project the dead
// Heroku app was running. See the README for starting it.
export const API =
  process.env.REACT_APP_API_URL || 'http://localhost:3333/api/users'

export const limitUserResults = 10

// Builds the request URL without assuming API has no query string of its own. Reaching
// for `${API}?limit=10` puts a second '?' in the URL the moment someone sets
// REACT_APP_API_URL to something with parameters already on it.
export const buildUsersUrl = ({ limit = limitUserResults, offset = 0 } = {}) => {
  const url = new URL(API, window.location.origin)
  url.searchParams.set('limit', String(limit))
  if (offset) url.searchParams.set('offset', String(offset))
  return url.toString()
}

// node-express-postgresql answers { "data": [ ... ] }. The dead Heroku endpoint
// returned a bare array, and so do plenty of other APIs, so both are accepted.
// Anything unrecognised becomes an empty list rather than a render error.
export const readUsers = body => {
  if (Array.isArray(body)) return body
  if (body && Array.isArray(body.data)) return body.data
  return []
}

// fetch() does NOT reject on 404 or 500; it only rejects on a network-level failure.
// Without this check the dead endpoint's HTML error page went straight into
// res.json(), and the user saw a JSON parse error instead of "404".
export const jsonOrThrow = async res => {
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}
