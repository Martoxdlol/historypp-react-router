export default function matchPath(routePath, path){
  let exact = true
  routePath = routePath.trim()
  path = path.split('?')[0]
  path = path.trim()
  if(routePath[routePath.length-1] == "/") routePath = routePath.substring(0,routePath.length-1)
  if(path[path.length-1] == "/") path = path.substring(0,path.length-1)
  if(routePath[0] == "/") routePath = routePath.substring(1)
  if(path[0] == "/") path = path.substring(1)
  const r = routePath.split("/")
  const p = path.split("/")
  if(r.length != p.length) exact = false
  if(p.length < r.length) return null
  let params = {}
  for (let i = 0; i < r.length; i++) {
    if(p[i] == r[i]){
      //Ok
    }else if(r[i].length >= 1 && r[i][0] == ":"){
      const key = r[i].substring(1)
      if(key != ""){
        params[key] = decodeURIComponent(p[i])
      }
    }else if(routePath == ""){
      exact = false
    }else{
      return null
      break;
    }
  }
  return {
    match: true,
    params,
    exact,
  }
}
