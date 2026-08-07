import React from 'react'

// Shared by all three containers so the comparison between them is only about HOW they
// fetch, not about how they render. It also puts the key in one place.
const UserList = ({ users, loading, error, onRetry }) => {
  if (loading) return <div>Loading...</div>

  if (error) {
    return (
      <div style={{ color: '#b00020' }}>
        <p>Could not load users: {error}</p>
        <p>
          Start{' '}
          <a href="https://github.com/alpersonalwebsite/node-express-postgresql">
            node-express-postgresql
          </a>{' '}
          locally, or point <code>REACT_APP_API_URL</code> at your own endpoint. See the
          README.
        </p>
        {onRetry && <button onClick={onRetry}>Retry</button>}
      </div>
    )
  }

  if (users.length === 0) return <div>No users returned.</div>

  return (
    <ul>
      {/*
        Keyed on user.id. This used to be key={uuid.v4()}, which generates a BRAND NEW
        key on every single render. A key is React's promise that "this is the same
        element as last time"; a fresh one breaks that promise every render, so React
        unmounts every row and mounts a replacement rather than updating it. That
        throws away DOM state (focus, text selection, scroll position, uncommitted
        input) and any state inside the row's subtree, and it turns an O(changed)
        update into an O(all) one. uuid was the wrong tool: a key has to be STABLE and
        derived from the data, which is exactly what an id already is.
      */}
      {users.map(user => (
        <li key={user.id}>
          {user.firstname} {user.lastname}
        </li>
      ))}
    </ul>
  )
}

export default UserList
