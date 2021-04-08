import { NavContext } from './contextManager'
import React, { Component, useContext } from 'react'



class ListenerComponent extends Component{
  constructor(props){
    super(props)
    this.state = {
      initialPosition: props.position,
      isCurrent: props.position == props.history.position,
      position: props.history.position,
    }
  }

  componentDidMount(){
    this.listener = this.props.history.addEventListener('locationchanged', e => {
      this.setState({
        position: e.position,
        isCurrent: this.state.initialPosition == e.position
      })
    })
  }
  componentWillUnmount(){
    this.listener()
  }

  render(){
    return this.props.child({...this.state})
  }
}

function UpdateOnLocationChange(props){
  const context = useContext(NavContext)
  return <ListenerComponent history={context.history} position={context.position} child={p => {
    return props.children
  }}/>
}

function ShowOnCurrentOnly(props){
  const context = useContext(NavContext)
  return <ListenerComponent history={context.history} position={context.position} child={p => {
    if(p.isCurrent) return <div>123 {props.children}</div>
    return ''
  }}/>
}

export default UpdateOnLocationChange
export { UpdateOnLocationChange, ShowOnCurrentOnly }
