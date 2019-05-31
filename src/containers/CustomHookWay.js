import React from 'react'
import { API, limitQuery, limitUserResults, offsetQuery } from '../apiConfiguration'
import useFetch from '../hooks/useFetch'
import uuid from 'uuid'

const CustomHookWay = props => {
  const users = useFetch(`${API}?${limitQuery}${limitUserResults}&${offsetQuery}20`, [])

  let renderingUsers = null
  renderingUsers = users.map(user => <div key={uuid.v4()}>{user.name}</div>)

  return (
    <React.Fragment>
      <h3>Custom Hooks Way</h3>
      {renderingUsers}
    </React.Fragment>
  )
}

export default CustomHookWay
