import React, { useState, useEffect, useCallback, useRef } from 'react'
import { buildUsersUrl, jsonOrThrow, readUsers } from '../apiConfiguration'
import UserList from '../components/UserList'

// Way 2: the same fetch with useState and useEffect, written out inline. Compare with
// CustomHookWay, which is this exact logic lifted into a reusable hook.
const HooksWay = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Two things this guards against, and they are the reason the extracted useFetch
  // carries the same machinery:
  //
  //   1. Unmount. Nothing cancels a fetch already in flight, so its handlers still run
  //      and still call setState, which React warns about and which is a leak.
  //   2. Superseded retries. Click Retry twice and two requests are in flight; if the
  //      first finishes LAST it overwrites the newer answer with the older one.
  //
  // A ref holding the id of the newest attempt settles both: a handler only writes if
  // it is still the current one.
  const attemptRef = useRef(0)
  const mountedRef = useRef(true)

  useEffect(
    () => () => {
      mountedRef.current = false
    },
    []
  )

  const fetchUsers = useCallback(() => {
    const attempt = attemptRef.current + 1
    attemptRef.current = attempt

    const isCurrent = () => mountedRef.current && attemptRef.current === attempt

    setLoading(true)
    setError(null)

    return fetch(buildUsersUrl({ offset: 10 }))
      .then(jsonOrThrow)
      .then(data => {
        if (isCurrent()) setUsers(readUsers(data))
      })
      .catch(err => {
        if (isCurrent()) {
          setError(err.message)
          setUsers([])
        }
      })
      .finally(() => {
        if (isCurrent()) setLoading(false)
      })
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
