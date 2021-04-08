import './css/app.css'
import ReactDOM from 'react-dom'
import React from 'react'
import Home from './pages/home'
import history2 from './history-plus'

window.history2 = initHistoryPlusPlus(history, {autoRestore:true})

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

ReactDOM.render(<Home history={window.history2}/>, document.getElementById('root'))
