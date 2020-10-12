export function padZero(str, len) {
  const modifiedLen = len || 2
  const zeros = new Array(modifiedLen).join('0')
  return (zeros + str).slice(-modifiedLen)
}


export const invertColor = hex => {
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
  return `#${padZero(r)}${padZero(g)}${padZero(b)}`
}

/**
 * Check if custom class exists.
 *
 * @param {HTMLElement} el [dom element]
 * @param {String} checkClass  [check class, no dot]
 */
export function hasClass (el, checkClass) {
  return el.className.match(new RegExp('(\\s|^)'+checkClass+'(\\s|$)'));
}


/**
 * Add custom class.
 *
 * @param {HTMLElement} el [dom element]
 * @param {String} newClass [add new class, no dot]
 */
export function addClass (el, newClass) {
  if (el.classList) el.classList.add(newClass)
  else el.className += ' ' + newClass
}


/**
 * Remove custom class.
 *
 * @param {HTMLElement} el [dom element]
 * @param {String} classToRemove [remove class, no dot]
 */
export function removeClass (el, classToRemove) {
  if (el.classList) el.classList.remove(classToRemove)
  else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + classToRemove.split(' ').join('|') + '(\\b|$)', 'gi'), '')

    const posLastCar = el.className.length - 1

    if (el.className[posLastCar] === ' ') el.className = el.className.substring(0, posLastCar)
  }

  // Remove class attribute if no classes left
  if (el.classList.length === 0) el.removeAttribute('class')
}

/**
* Get data-attribute matching an element and attribute suffix
*
* @param {HTMLElement} el [dom element]
* @param {String} attr [data-attr suffix]
*/
export function getAttribute(el, attr) {
  return el.getAttribute('data-' + attr)
}


/**
* Get data-attribute matching an element and attribute suffix
*
* @param {HTMLElement} el [dom element]
* @param {String} attr [data-attr suffix]
* @return {Object} contains width and height properties
*/
export function setAttribute(el, attr, val = "") {
  if (el.getAttribute('data-' + attr) != val) el.setAttribute('data-' + attr, val)
}


/**
* Toggle boolean data-attribute
*
* @param {HTMLElement} el [dom element]
* @param {String} attr [data-attr suffix]
*/
export function toggleAttribute(el, attr) {
  if (el.getAttribute('data-' + attr) === 'true') el.setAttribute('data-' + attr, 'false')
  else el.setAttribute('data-' + attr, 'true')
}

/**
* Toggle boolean data-attribute
*
* @return {Boolean} returns false if nothing matches the conditions
*/
export function isRetina() {
  var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
          (min--moz-device-pixel-ratio: 1.5),\
          (-o-min-device-pixel-ratio: 3/2),\
          (min-resolution: 1.5dppx)";

  if (window.devicePixelRatio > 1) return true;
  if (window.matchMedia && window.matchMedia(mediaQuery).matches) return true;

  return false;
}

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export function getUrlVars() {
  const vars = []
  let hash
  const hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')

  for (let i = 0; i < hashes.length; i += 1) {
    hash = hashes[i].split('=')
    vars.push(hash[0])
    vars[hash[0]] = hash[1]
  }
  return vars
}
