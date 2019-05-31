import React, { Component } from 'react'
import { API, limitQuery, limitUserResults } from '../apiConfiguration'
import uuid from 'uuid'

class RegularWay extends Component {
  constructor (props) {
    super()
    this.state = {
      users: []
    }
  }

  componentDidMount () {
    fetch(`${API}?${limitQuery}${limitUserResults}`)
      .then(res => res.json())
      .then(data => this.setState({ users: data }))
      .catch(error => console.log('RegularWay', error))
  }

  render () {
    const { users } = this.state

    let renderingUsers = null
    renderingUsers = users.map(user => <div key={uuid.v4()}>{user.name}</div>)

    return (
      <React.Fragment>
        <h3>Regular Way</h3>
        {renderingUsers}
      </React.Fragment>
    )
  }
}

export default RegularWay
