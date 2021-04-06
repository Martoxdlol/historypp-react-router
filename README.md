react-router for History Plus Plus (with fancy animations)
=================
# Demo

There is no explanation or documentatio yet

I will put a demo link and some more docs on the future

## index.js

```javascript
import './css/app.css'
import ReactDOM from 'react-dom'
import React from 'react'
import Router from './router'
// import { createHistory } from 'historypp'
import { createHistory } from 'historypp'

window.history2 = createHistory(window.history, {autoRestore:true}) //Restore history from local when a complete reload ocures

```


## router.js

```javascript
import React, { Component } from 'react'
import Router, { Route, Link } from './modules/historypp-react-router'
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

```

## pages/home/home.js
```javascript
import React, { Component } from 'react'
import { Link, LinkPopOnBack, LinkReplace } from '../../modules/historypp-react-router'
import axios from 'axios'

export default class Home extends Component{
  constructor(props){
    super(props)
    this.state = {
      ...this.props.state,
    }
  }

  //Loads initial data for page (is static to be used on server side rendering)
  static async initialData(){
    try {
      return {
        ...(await axios.get('http://worldtimeapi.org/api/timezone/America/Argentina/Salta')).data,
        initialDataLoaded: true
      }
    } catch (e) {
      return {
        initialDataError: true,
      }
    }
  }

  //data could be received from saved state managed from router
  async componentDidMount(){
    if(!this.state.initialDataLoaded){ //initialDataLoaded is used to know if the data is loaded
      const initialData = await Home.initialData()
      this.setState({...initialData})
    }
    const asyncModule = await import(/* webpackPrefetch: true */'./asyncHeavyModule.js')
    this.setState({
      asyncModule
    })
  }

  componentDidUpdate(){
    //Saves data to router state manager
    this.props.saveState(this.state)
  }

  render(){
    const AsyncLoadedComponent = this.state.asyncModule && this.state.asyncModule.default
    return (<div>
      Actual time:
      <br/>
      {this.state.initialDataLoaded && this.state.datetime}
      {this.state.initialDataError && "Error loading data"}
      <br/>
      <Link to="/timezones">Timezones</Link>
      <br/>
      <LinkPopOnBack to="/random">Random #1</LinkPopOnBack> Cannot return to it going forward
      <br/>
      <LinkReplace to="/random">Random #2</LinkReplace> Replace actual page
      <br/>
      <Link to="/404error">404 fallback</Link>
      <br/>
      {AsyncLoadedComponent && <AsyncLoadedComponent/>}
    </div>)
  }
}
```

## pages/timezones/timezones.js

```javascript

import React, { Component } from 'react'
import { Link } from '../../modules/historypp-react-router'
import axios from 'axios'

export default class Home extends Component{
  constructor(props){
    super(props)
    this.state = {
      ...this.props.state,
    }
  }

  //Loads initial data for page (is static to be used on server side rendering)
  static async initialData(){
    try {
      return {
        timezones: (await axios.get('http://worldtimeapi.org/api/timezone')).data,
        initialDataLoaded: true
      }
    } catch (e) {
      return {
        initialDataError: true,
      }
    }
  }

  //data could be received from saved state managed from router
  async componentDidMount(){
    if(!this.state.initialDataLoaded){ //initialDataLoaded is used to know if the data is loaded
      const initialData = await Home.initialData()
      this.setState({...initialData})
    }
  }

  componentDidUpdate(){
    //Saves data to router state manager
    this.props.saveState(this.state)
  }

  render(){
    const loading = !this.state.initialDataLoaded && !this.state.initialDataError
    return (<div>
      <Link to="/">Home /</Link>
      <br/>
      <br/>
      {loading && "Loading timezones..."}
      {this.state.initialDataLoaded && this.state.timezones.map((timezone,i) => {
        return <div key={i}>
          <Link to={"/timezone/"+encodeURIComponent(timezone)}>{timezone}</Link>
        </div>
      })}
    </div>)
  }
}

```
