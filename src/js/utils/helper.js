const getDrawerParam = (type, drawerWidth) => {
  let animDrawer = { width: '50%' }

  if (type === 'industrial') {
    animDrawer = { width: `${100 - drawerWidth}%` }
  }

  if (type === 'visual') {
    animDrawer = { width: `${100 - drawerWidth}%` }
  }

  return animDrawer
}


const getDrawerParamMobile = type => {
  let animDrawer = { height: '50%' }

  if (type === 'industrial') {
    animDrawer = { height: '100%' }
  }

  if (type === 'visual') {
    animDrawer = { height: '100%' }
  }

  return animDrawer
}


function padZero(str, len) {
  const modifiedLen = len || 2
  const zeros = new Array(modifiedLen).join('0')
  return (zeros + str).slice(-modifiedLen)
}


const invertColor = hex => {
  let h = hex

  if (h.indexOf('#') === 0) {
    h = h.slice(1)
  }
  // convert 3-digit hex to 6-digits.
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  }
  if (h.length !== 6) {
    throw new Error('Invalid HEX color.')
  }
  // invert color components
  const r = (255 - parseInt(h.slice(0, 2), 16)).toString(16)
  const g = (255 - parseInt(h.slice(2, 4), 16)).toString(16)
  const b = (255 - parseInt(h.slice(4, 6), 16)).toString(16)
  // pad each with zeros and return
  return '#' + padZero(r) + padZero(g) + padZero(b)
}


export {
  getDrawerParam,
  getDrawerParamMobile,
  invertColor,
}
