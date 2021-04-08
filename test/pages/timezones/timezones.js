import React, { Component } from 'react'
import { Link } from '../../../src/historypp-react-router'
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
        timezones: (await axios.get('https://worldtimeapi.org/api/timezone')).data,
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
