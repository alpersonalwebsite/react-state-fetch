import React, { Component } from 'react'
import { buildUsersUrl, jsonOrThrow, readUsers } from '../apiConfiguration'
import UserList from '../components/UserList'

// Way 1: a class component, fetching in componentDidMount and holding the result in
// this.state. The pre-hooks way, and still what you get from an older codebase.
class RegularWay extends Component {
  state = {
    users: [],
    loading: true,
    error: null
  }

  componentDidMount() {
    this.fetchUsers()
  }

  componentWillUnmount() {
    // Nothing cancels a fetch that is already in flight, so record that we are gone and
    // let the handlers skip setState. Otherwise React warns about setting state on an
    // unmounted component, which is the class-component version of the leak the hook
    // guards against with its `cancelled` flag.
    this.unmounted = true
  }

  fetchUsers = () => {
    this.setState({ loading: true, error: null })

    return fetch(buildUsersUrl())
      .then(jsonOrThrow)
      .then(data => {
        if (!this.unmounted) this.setState({ users: readUsers(data), loading: false })
      })
      .catch(error => {
        if (!this.unmounted) {
          this.setState({ error: error.message, users: [], loading: false })
        }
      })
  }

  render() {
    return (
      <React.Fragment>
        <h3>Regular Way</h3>
        <UserList {...this.state} onRetry={this.fetchUsers} />
      </React.Fragment>
    )
  }
}

export default RegularWay
