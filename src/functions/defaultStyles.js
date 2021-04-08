exports.defaultStyle = e => {
  return {
    boxShadow: '0px 0px 18px -1px rgba(0,0,0,0.4)'
  }
}

exports.open = e => {
  return {
    left: '0',
    bottom: '0'
  }
}

exports.hidden = e => {
  return {
    left: '-30%'
  }
}

exports.close = e => {
  return {
    left: '103%'
  }
}

function getMode(){
  if(window.document.body.offsetWidth < 601) return 'mobile'
  else return 'pc'
}
