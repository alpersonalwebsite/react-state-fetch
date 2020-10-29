import React, { useState, useEffect } from 'react'
import { API, limitQuery, limitUserResults, offsetQuery } from '../apiConfiguration'
import uuid from 'uuid'

const HooksWay = () => {
  const [usersState, setUsersState] = useState([])

  useEffect(() => {
    fetch(`${API}?${limitQuery}${limitUserResults}&${offsetQuery}10`)
      .then((res) => res.json())
      .then((data) => setUsersState(data))
      .catch((error) => console.log('HooksWay', error))
  }, [])

  let renderingUsers = null
  renderingUsers = usersState.map((user) => <div key={uuid.v4()}>{user.name}</div>)

  return (
    <React.Fragment>
      <h3>Hooks Way</h3>
      {renderingUsers}
    </React.Fragment>
  )
}

export default HooksWay
