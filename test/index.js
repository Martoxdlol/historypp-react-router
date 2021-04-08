import './css/app.css'
import ReactDOM from 'react-dom'
import React from 'react'
import Router from './router'
import { createHistory } from 'historypp'

window.history2 = createHistory(window.history, {autoRestore:true}) //Restore history from local when a complete reload ocures

// IE compatibility things
if(!('isFinite' in Number)){
  Number.isFinite = function(num){
    if(!num && num != 0) return false
    if(!(num > 0 || num < 1)) return false
    if(num == Infinity || num == -Infinity) return false
    return true
  }
}

if(!('isInteger' in Number)){
  Number.isInteger = function(num){
    if(!Number.isFinite(num)) return false
    if(Math.floor(num) != num) return false
    return true
  }
}

ReactDOM.render(<Router history={window.history2}/>, document.getElementById('root'))
