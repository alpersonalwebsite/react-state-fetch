import React from 'react'
import RegularWay from '../containers/RegularWay'
import HooksWay from '../containers/HooksWay'
import CustomHookWay from '../containers/CustomHookWay'
import './App.css'

function App () {
  return (
    <React.Fragment>
      <h1>Fetching and setting state with React...</h1>
      <RegularWay />
      <HooksWay />
      <CustomHookWay />
    </React.Fragment>
  )
}

export default App
