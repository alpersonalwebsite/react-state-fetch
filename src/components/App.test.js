import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

// All three containers fetch on mount, so window.fetch is stubbed: a test called
// "renders without crashing" should not depend on a local API being up.
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, status: 200, statusText: 'OK', json: () => Promise.resolve({ data: [] }) })
  )
})

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})
