import { Component } from 'react'

export default class Route extends Component{
  static isRoute = true
  constructor(props){
    super(props)
    this.path = props.path
    this.updateOnBack = !!props.updateOnBack
    this.isExact = !!(props.isExact || props.exact)
    this.isRoute = true
    this.background = props.background
    this.state = {
    }
  }

  render(){
    return ""
  }
}
