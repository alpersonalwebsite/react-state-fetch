import React, { useMemo } from 'react'
import { buildUsersUrl } from '../apiConfiguration'
import useFetch from '../hooks/useFetch'
import UserList from '../components/UserList'

// Way 3: the same logic again, extracted into useFetch. Note what the extraction buys:
// the component below has no fetch, no error handling and no loading flag of its own,
// and useFetch can now be used by anything.
const CustomHookWay = () => {
  // useMemo because useFetch depends on the URL. Building the string inline would
  // produce an identical but NEW string on every render... which is fine for a string,
  // since === compares by value, but the memo makes the dependency explicit and stops
  // this becoming a re-fetch loop the moment the argument turns into an object.
  const url = useMemo(() => buildUsersUrl({ offset: 20 }), [])
  const { users, loading, error } = useFetch(url)

  return (
    <React.Fragment>
      <h3>Custom Hooks Way</h3>
      <UserList users={users} loading={loading} error={error} />
    </React.Fragment>
  )
}

export default CustomHookWay
