import { useState, useEffect } from 'react'
import { jsonOrThrow, readUsers } from '../apiConfiguration'

// Returns { users, loading, error } rather than a bare array, because a caller that
// only gets an array cannot tell "still loading" from "failed" from "nobody matched".
const useFetch = URI => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // The dependency array was [], with URI read from the closure. Create React App's
    // own linter said so on every build:
    //
    //   React Hook useEffect has a missing dependency: 'URI'
    //     react-hooks/exhaustive-deps
    //
    // and CI=false in the pipeline is what kept anyone from seeing it. The effect
    // never re-ran, so the hook silently ignored a changed URL: a custom fetch hook
    // that cannot refetch.
    // A flag stops us writing state after the fact; an AbortController stops the request
    // itself, so a superseded or unmounted fetch is not still occupying a connection and
    // downloading a body nobody will read.
    let cancelled = false
    const controller = new AbortController()

    setLoading(true)
    setError(null)

    fetch(URI, { signal: controller.signal })
      .then(jsonOrThrow)
      .then(data => {
        // Guard against setting state after unmount, or after URI changed and an older
        // in-flight request finished last. Without it, two requests race and the slower
        // one wins.
        if (!cancelled) setUsers(readUsers(data))
      })
      .catch(err => {
        // An abort rejects with AbortError. That is us, not a failure, so it must not be
        // rendered as one.
        if (!cancelled && err.name !== 'AbortError') {
          setError(err.message)
          setUsers([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [URI])

  return { users, loading, error }
}

export default useFetch
