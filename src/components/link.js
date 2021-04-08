import { NavContext } from './contextManager'
import React, { useContext } from 'react'


export default function Link(props){
  const context = useContext(NavContext);
  const props2 = {...props}
  delete props2['onlyOneTime']
  return <a {...props2} href={props.href || props.to} onClick={e => {
    e.preventDefault()
    if(props.onClick){
      props.onClick(e)
    }
    context.history.navigate(props.to,{onlyOneTime:!!(props.onlyOneTime || props.unfordward)})
  }}/>
}

export function LinkPopOnBack(props){
  const context = useContext(NavContext);
  const props2 = {...props}
  delete props2['onlyOneTime']
  return <a {...props2} href={props.href || props.to} onClick={e => {
    e.preventDefault()
    if(props.onClick){
      props.onClick(e)
    }
    context.history.navigate(props.to,{onlyOneTime:true})
  }}/>
}

export function LinkReplace(props){
  const context = useContext(NavContext);
  const props2 = {...props}
  delete props2['onlyOneTime']
  return <a {...props2} href={props.href || props.to} onClick={e => {
    e.preventDefault()
    if(props.onClick){
      props.onClick(e)
    }
    context.history.navigateReplace(props.to,{onlyOneTime:!!(props.onlyOneTime || props.unfordward)})
  }}/>
}
