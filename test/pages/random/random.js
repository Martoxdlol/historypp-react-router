import React, { Component } from 'react'
import { Link } from '../../../src/historypp-react-router'

export default class Home extends Component{
  constructor(props){
    super(props)
    this.state = {
      ...this.props.state,
      value: getRandomInt(100000,999999)
    }
  }

  render(){
    return (<div>
      Random value: {this.state.value} | <Link to="/timezones">Timezones</Link>
    </div>)
  }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
