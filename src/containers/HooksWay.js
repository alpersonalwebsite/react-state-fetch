import React, { useState, useEffect } from 'react'
import { API, limitQuery, limitUserResults } from '../apiConfiguration'
import uuid from 'uuid'

const HooksWay = props => {
  const [usersState, setUsersState] = useState([])

  useEffect(() => {
    fetch(API + limitQuery + limitUserResults)
      .then(res => res.json())
      .then(data => setUsersState(data))
      .catch(error => console.log('HooksWay', error))
  })

  let renderingUsers = null
  renderingUsers = usersState.map(user => <div key={uuid.v4()}>{user.name}</div>)

  return (
    <React.Fragment>
      <h3>Hooks Way</h3>
      {renderingUsers}
    </React.Fragment>
  )
}

export default HooksWay
