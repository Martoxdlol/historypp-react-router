import React, { Component } from 'react'
import Route from './route'
// import Link from './link'
import NavContextComponent, { NavContext } from './contextManager'
import matchPath from './matchPath'
import Helmet from 'react-helmet'

import { open as openStyleDefault, close as closeStyleDefault, defaultStyle as defaultStyleDefault, hidden as hiddenStyleDefault } from '../functions/defaultStyles'

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const Route404 = <Route path="/" exact={false}></Route>
export default class RouterHPP extends Component{
  constructor(props){
    super(props)
    this.history = props.history
    if(!history) throw "props.history is undefined. "
    if(this.history == window.history) throw "native history not suported. Use HistoryPlusPlus for this component. "
    this.state = {
      pos: 0,
      items: [],
    }
    this._firstRender = true

    this.getMatchingRouteChildren = this.getMatchingRouteChildren.bind(this)
    this.getMatchingRoute = this.getMatchingRoute.bind(this)
    this.createItem = this.createItem.bind(this)

    this.lastLength = 0
    if(props.transitionDuration && Number.isFinite(props.transitionDuration) && props.transitionDuration >= 0 && props.transitionDuration <= 15) this.transitionDuration = props.transitionDuration
    else this.transitionDuration = 0.3

    this.dst = {
      openStyleDefault,closeStyleDefault,defaultStyleDefault,hiddenStyleDefault,
      ...this.props.transitionStyles,
    }
  }

  componentDidMount(){
    const initialItems = []
    const historyList = this.history.list

    //Load all items
    // for (let i = 0; i < historyList.length; i++) {
    //   const routeChild = this.getMatchingRoute(historyList[i].url)
    //   if(routeChild){
    //     const m = {...matchPath(routeChild.props.path, historyList[i].url)}
    //     initialItems[i] = this.createItem(routeChild,m.params)
    //   }else{
    //     initialItems[i] = this.createItem(Route404,{})
    //   }
    // }

    //Load current item only
    const routeChild = this.getMatchingRoute(this.history.url)
    if(routeChild){
      const m = {...matchPath(routeChild.props.path, this.history.url)}
      initialItems[this.history.position] = this.createItem(routeChild,m.params)
    }else{
      initialItems[this.history.position] = this.createItem(Route404,{})
    }
    this.setState({
      pos: this.props.history.position,
      items: initialItems,
    })
    window.addEventListener('scroll', e => {
      this.history.list[this.history.position].scrollSnapshot = window.scrollY
    })
    this.history.addEventListener('locationchanged', e => {
      const items = this.state.items

      if(e.isnew){
        //totally different an new route (no really different but yes)
        const route = this.getMatchingRoute(e.url) || Route404
        const m = {...matchPath(route.props.path, e.url)}
        items[e.position] = this.createItem(route,m.params)
      }else if(!items[e.position]){
        //not new but the item was deleted to save resources

        //try to use same route as original
        const route = (items[e.position] && items[e.position].route) || this.getMatchingRoute(e.url) || Route404
        const m = {...matchPath(route.props.path, e.url)}
        items[e.position] = this.createItem(route,m.params)
      }else{
        //get route (try to get original)
        const route = (items[e.position] && items[e.position].route) || this.getMatchingRoute(e.url) || Route404
        const m = {...matchPath(route.props.path, e.url)}
        //Update component
        if(route.props.updateOnBack) items[e.position] = this.createItem(route,m.params)

      }

      //Delete far items to save resources
      if(items[e.position-40]) delete items[e.position-40]
      if(items[e.position-40]) delete items[e.position-40]
      this.setState({
        lastPos: this.state.position,
        pos: e.position,
        items,
      })
    })


    this.history.addEventListener('splice', e => {
      //When some item of history list is removed
      //We must update router, if not it will do incorrect things
      setTimeout(() => {
        const items = this.state.items
        items.splice(e.start,e.length)
        this.setState({
          pos: this.state.pos+(e.movement || 0),
          items
        })
      }, this.transitionDuration*1000)
    })
  }

  getMatchingRoute(path){
    //Get route from routes (router children)
    let children = []
    if(Array.isArray(this.props.children)){
      children = this.props.children
    }else if(this.props.children != undefined){
      children.push(this.props.children)
    }
    let rs = []
    if(Array.isArray(this.props.routes)){
      for(const r of this.props.routes){
        rs.push({...r,props:{...r}})
      }
    }
    children = [...children, ...rs]
    for(const child of children){
      if(child.props.path && child.type == Route){
        const m = matchPath(child.props.path, path)
        //Match path
        if(m && m.match && (m.exact || child.props.exact === false)){
          return child
        }
      }
    }
    return null
  }

  getMatchingRouteChildren(path){
    return ({...this.getMatchingRoute(path)}).children
  }

  createItem(obj,params){
    //route is actally route.children and obj is route

    //Set if route is defined or not
    params = {...params}
    let noroute = false
    let route
    if(obj && obj.type == Route){
      route = obj.props.children
    }else{
      route = obj || ""
      obj = {props:{}}
      noroute = true
    }
    const historyState = {...this.history.state}
    const position = this.history.position
    const t = this
    const p = t.state.pos
    const contextData = {
      history: this.history,
      savedState: {...historyState.savedState},
      get isCurrent(){
        return p == t.history.position
      },
      registerOnCurrentOnly: (pos, instance) =>{
        this.showOnCurrentOnlyInstances[pos] = instance
      },
      position: p
    }
    function saveState(s){
      if(!this.history.list[position]) return;
      if(typeof this.history.list[position].state == 'undefined') this.history.list[position].state = {}
      if(typeof this.history.list[position].state == 'object'){
        this.history.list[position].state.savedState = s
      }
    }
    const initialData = this.history.state
    let child = []
    const makeProps = (c) => {
      return {state:initialData, params, initialData, saveState, history: this.history, ...c.props, route: obj, context:{...c.props.context, params, saveState, ...contextData}}
    }
    if(Array.isArray(route)){
      for(const c of route){
        if(typeof c == "string"){
          child.push(c)
        }else if(typeof c == 'object' && c.type && typeof c.type == 'string'){
          child.push(React.createElement(c.type, c.props))
        }else if(typeof c == 'object' && c.type){
          child.push(React.createElement(c.type,makeProps(c)))
        }else if(typeof c == 'function'){
          child.push(React.createElement(c,makeProps(c)))
        }
      }
    }else{
      const c = route
      if(typeof c == "string"){
        child.push(c)
      }else if(typeof c == 'object' && c.type && typeof c.type == 'string'){
        child.push(React.createElement(c.type, c.props))
      }else if(typeof c == 'object' && c.type){
        child.push(React.createElement(c.type, makeProps(c)))
      }else if(typeof c == 'function'){
        child.push(React.createElement(c, makeProps(c)))
      }else{
        child.push("")
      }
      child = child[0]
    }

    const r = {
      key: uuidv4(),
      params,
      timestamp: Date.now(),
      route:obj,
      ref: React.createRef(),
      openStyle: obj.props.openStyle || this.dst.openStyleDefault,
      closeStyle: obj.props.closeStyle || this.dst.closeStyleDefault,
      defaultStyle: obj.props.defaultStyle || this.dst.defaultStyleDefault,
      hiddenStyle: obj.props.hiddenStyle || this.dst.hiddenStyleDefault,
      child:<NavContextComponent value={contextData}>
      {child}
    </NavContextComponent>}

    if(!noroute){
      r.route = obj
    }

    return r
  }

  goToPos(){

  }

  scollListener(position){
    //No in use, with this router it is not longer necessary to know the scroll position except on deleted router history list but i dont care
    //Also it breaks history local saving because of element stringified to JSON
    //It is neccesary to do another way of indentifing childs (could be using position)
    return e => {
    //   const element = e.target
    //   if(typeof this.history.list[position].state == 'undefined') this.history.list[position].state = {}
    //   if(typeof this.history.list[position].state == 'object'){
    //     this.history.list[position].state.scrollSnapshot = element.scrollTop
    //     this.history.list[position].state.scrollSnapshotElement = element
    //   }
    }
  }

  componentDidUpdate(){
    try {
      const s = this.history.list[this.state.pos].state.scrollSnapshot || 0
      const e = this.history.list[position].state.scrollSnapshotElement
      //Future to do: Get element by chidlren and index of the router
      e.scrollTo(0,s)
    } catch (e) {}
    for (let i = 0; i < this.state.items.length; i++) {
      const item = this.state.items[i]
      if(item && !item.deleted){
        const element = this.state.items[i].ref.current
        if(!element) return;
        let s = {visibility:'', overflow:'auto', height:'100%',width:'100%', position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, transition: `top ${this.transitionDuration}s, left ${this.transitionDuration}s, bottom ${this.transitionDuration}s, right ${this.transitionDuration}s`}
        if(item.defaultStyle) s = {...s, ...item.defaultStyle(item.ref.current)}
        if(i <= this.state.pos) s.visibility = ''
        if(i == this.state.pos){
          s = {...s, ...item.openStyle(item.ref.current)}
          this.state.items[i].closed = false
        }else if(i < this.state.pos){
          s = {...s, ...item.hiddenStyle(item.ref.current)}
          this.state.items[i].closed = false
        }else{
          s = {...s, ...item.closeStyle(item.ref.current)}
          this.state.items[i].closed = true
        }

        this.state.items[i].style = s
        setTimeout(() => {
          applyProps(element,'style',s)
        }, 0)
      }
    }
  }


  render(){
    const currentItem = this.state.items[this.state.pos] || {key:uuidv4()}
    const r = [
      <Helmet key={"_helmet_"+currentItem.key}>{(currentItem && currentItem.route && currentItem.route.props.helmet) ? currentItem.route.props.helmet : ''}</Helmet>
      ,<div style={{width:"100%",overflow:"hidden"}} key="items_container">
      {[...this.state.items.map((item, i) => {
        const isCurrent = i == this.state.pos
        // const isLastPos = i == this.state.lastPos
        // const changed = isCurrent != isLastPos
        const isLast = i == this.state.items.length-1
        // const isNew = this._lastRenderedI < i
        let style = {}
        // if(isLast && isNew && isCurrent){
        //   // style = item.closeStyle()
        // }else if(isCurrent && isNew){
        //
        // }
        if(item.style && !item.closed){
          style = item.style
        }else if(i != 0 && !this._firstRender){
          style = item.closeStyle()
        }else if(i < this.state.pos){
          style = item.hiddenStyle()
        }else{
          style = item.openStyle()
        }
        this._firstRender = false
        //Hide previos loaded pages (no es totalmente necesario pero es para ahorrar recursos)
        if(!isLast && !isCurrent && this.state.pos > i+3) style.display = 'none'

        return <div key={item.key} style={{overflow:'auto', height:'100%',width:'100%', position: 'fixed', visibility:'', background:item.route.props.background || 'white',...style}} ref={item.ref} onScroll={this.scollListener(i)}>{item.child}</div>
      }),
    ]}

    </div>]
    this.lastLength = r.length
    return r
  }
}

function applyProps(_object, name, props){
  const keys = Object.keys(props)
  for(const key of keys){
    _object[name][key] = props[key]
  }
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// export { Link, Route }
