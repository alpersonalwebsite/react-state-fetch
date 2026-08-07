import React, { useState, useEffect, useCallback } from 'react'
import { buildUsersUrl, jsonOrThrow, readUsers } from '../apiConfiguration'
import UserList from '../components/UserList'

// Way 2: the same fetch with useState and useEffect, written out inline. Compare with
// CustomHookWay, which is this exact logic lifted into a reusable hook.
const HooksWay = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // useCallback so the effect below has a stable dependency, and so Retry can call the
  // same function the effect does.
  const fetchUsers = useCallback(() => {
    setLoading(true)
    setError(null)

    return fetch(buildUsersUrl({ offset: 10 }))
      .then(jsonOrThrow)
      .then(data => setUsers(readUsers(data)))
      .catch(err => {
        setError(err.message)
        setUsers([])
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <React.Fragment>
      <h3>Hooks Way</h3>
      <UserList users={users} loading={loading} error={error} onRetry={fetchUsers} />
    </React.Fragment>
  )
}

export default HooksWay
