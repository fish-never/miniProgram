function rid(){
    const now = new Date()
    const year = now.getFullYear()
    const month = _datefix(now.getMonth() + 1)
    const date = _datefix(now.getDate())
    const hour = _datefix(now.getHours())
    const minute = _datefix(now.getMinutes())
    const second = _datefix(now.getSeconds())
    let random4 = Math.floor((Math.random() * 1000)).toString()
    const length = 4 - random4.length;   
    for (let i = 0; i < length ; i++){
        random4 = '0' + random4
    }
    return `${year}${month}${date}${hour}${minute}${second}${random4}`
}

function timestamp(date = new Date()){
    const year = date.getFullYear()
    const month = _datefix(date.getMonth() + 1)
    const dateStr = _datefix(date.getDate())
    const hour = _datefix(date.getHours())
    const minute = _datefix(date.getMinutes())
    const second = _datefix(date.getSeconds())
    return `${year}-${month}-${dateStr} ${hour}:${minute}:${second}`
}

function encodeUrlParams(params) {
    return Object.keys(params)
      .filter((prop) => {
        const value = params[prop];
        return value !== undefined;
      })
      .map((prop) => {
        return [prop, params[prop]].map(encodeURIComponent).join('=');
      })
      .join('&');
  }

function _datefix(n) {
    return n<10 ? ('0'+n) : n
}

export {
    rid,
    timestamp,
    encodeUrlParams
}

