import React, { Component } from 'react'
import { Link } from '../../../src/historypp-react-router'
import axios from 'axios'

export default class Home extends Component{
  constructor(props){
    super(props)
    this.state = {
      ...this.props.state,
    }
    this.divref = React.createRef()
  }

  //Loads initial data for page (is static to be used on server side rendering)
  static async initialData(params){
    try {
      return {
        ...(await axios.get('https://worldtimeapi.org/api/timezone/'+params.id)).data,
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

    //Check initial data
    if(!this.state.initialDataLoaded){ //initialDataLoaded is used to know if the data is loaded
      const initialData = await Home.initialData(this.props.params)
      this.setState({...initialData})
    }
  }

  componentDidUpdate(){
    //Saves data to router state manager
    this.props.saveState(this.state)
  }


  render(){
    const loading = !this.state.initialDataLoaded && !this.state.initialDataError
    return (<div ref={this.divref}>
      Timezone: {this.state.timezone}
      <br/>
      Actual time: {this.state.initialDataLoaded && this.state.datetime}
      {this.state.initialDataError && "Error loading data"}{loading && "Loading..."}
      <br/>
      <br/>
      <Link to="/timezones">Timezones</Link>
      <br/>
      <button type="button" onClick={e => this.props.history.back()}>{'< Back'}</button>
    </div>)
  }
}
