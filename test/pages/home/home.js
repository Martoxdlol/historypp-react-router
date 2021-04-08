import React, { Component } from 'react'
import { Link, LinkPopOnBack, LinkReplace } from '../../../src/historypp-react-router'
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
        ...(await axios.get('https://worldtimeapi.org/api/timezone/America/Argentina/Salta')).data,
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
