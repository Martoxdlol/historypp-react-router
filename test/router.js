import React, { Component } from 'react'
// import Router, { Route, Link } from '../src/historypp-react-router'
import Router, { Route, Link } from '../src/historypp-react-router'
import Home from './pages/home/home'
import Timezones from './pages/timezones/timezones'
import Timezone from './pages/timezone/timezone'
import Random from './pages/random/random'

export default class RouterComponent extends Component{
  constructor(props){
    super(props)
    this.state = {}
  }

  render(){
    //This router requires a HistoryPlusPlus instance to work
    //Transition duration in seconds (default: 0.3)
    return <Router history={this.props.history} transition={0.5}>
      <Route path="/" helmet={<title>HOME - React: HistoryPP - Router - Dialogs</title>}>
        <Home/>
      </Route>
      <Route path="/timezones" background="pink" helmet={<title>TIMEZONES - React: HistoryPP - Router - Dialogs</title>}>
        <Timezones/>
      </Route>
      <Route path="/timezone/:id" helmet={<title>ZONE - React: HistoryPP - Router - Dialogs</title>}>
        <Timezone/>
      </Route>
      <Route path="/random"
        helmet={<title>RANDOM - React: HistoryPP - Router - Dialogs</title>}
        defaultStyle={elem => {
          return {
            background:"yellow",
            transition: '0.5s',
          }
        }}
        closeStyle={elem => {
          return {
            top: '103%',
            border: '10px solid red',
          }
        }}
        openStyle={elem => {
          return {
            top: '0',
            transition: '2s',
            border: '10px solid green',
          }
        }}
        hiddenStyle={elem => {
          return {
            top: '-60%',
            border: '10px solid blue'
          }
      }}>
        Multiple childs supported on the router, every child has access to route data
        <Random/>
        <Random/>
        <Random/>
        <Random/>
        <Random/>
        <Random/>
      </Route>
      <Route path="/" exact={false} helmet={<title>404 - React: HistoryPP - Router - Dialogs</title>}>
        404 [sad face]
      </Route>
    </Router>
  }
}
