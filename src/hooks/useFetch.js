import { useState, useEffect } from 'react'

const useFetch = (URI, defaultStateValue) => {
  const [usersState, setUsersState] = useState(defaultStateValue)

  useEffect(() => {
    fetch(URI)
      .then(res => res.json())
      .then(data => setUsersState(data))
      .catch(error => console.log('useFetch', error))
  })

  return usersState
}

export default useFetch
