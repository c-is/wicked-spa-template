export default class Handler {
  static events = {}

  /**
   * Attach an event handler function.
   * @param  {string}   eventName please use static names
   * @param  {Function} handler   callback function
   * @return {Handler}            returns current object
   */
  on(eventName, handler) {
    if (!Handler.events[eventName]) {
      Handler.events[eventName] = []
    }

    Handler.events[eventName].push(handler)
    return this
  }

  /**
   * Detach an event handler function.
   * @param  {string}   eventName please use static names
   * @param  {Function} handler   callback function
   * @return {Handler}            returns current object
   */
  off(eventName, handler) {
    if (typeof eventName === 'undefined') {
      Handler.events = {}
      return this
    }

    if (typeof handler === 'undefined' && Handler.events[eventName]) {
      Handler.events[eventName] = []
      return this
    }

    if (!Handler.events[eventName]) {
      return this
    }

    const index = Handler.events[eventName].indexOf(handler)

    if (index > -1) {
      Handler.events[eventName].splice(index, 1)
    }

    return this
  }

  /**
   * Call an event handler function.
   * @param {string} eventName
   * @param {[type]} ...extraParameters pass any parameters to callback function
   */

  trigger = async (eventName, event, ...args) => {
    if (!Handler.events[eventName]) {
      return Promise.resolve()
    }

    const l = Handler.events[eventName].length

    if (!l) {
      return Promise.resolve()
    }

    for (const [i] of Handler.events[eventName].entries()) {
      await Handler.events[eventName][i](...[event, ...args])
    }

    return Promise.resolve()
  }

  destroy() {
    Handler.events = {}
  }
}
