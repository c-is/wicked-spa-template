export default class Handler {
  static events = {};

  /**
   * Attach an event handler function.
   * @param  {string}   eventName please use static names
   * @param  {Function} handler   callback function
   * @return {Handler}            returns current object
   */
  on(eventName, handler) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(handler);
    return this;
  }

  /**
   * Detach an event handler function.
   * @param  {string}   eventName please use static names
   * @param  {Function} handler   callback function
   * @return {Handler}            returns current object
   */
  off(eventName, handler) {
    if (typeof eventName === 'undefined') {
      this.events = {};
      return this;
    }

    if (typeof handler === 'undefined' && this.events[eventName]) {
      this.events[eventName] = [];
      return this;
    }

    if (!this.events[eventName]) {
      return this;
    }

    const index = this.events[eventName].indexOf(handler);

    if (index > -1) {
      this.events[eventName].splice(index, 1);
    }

    return this;
  }

  /**
   * Call an event handler function.
   * @param {string} eventName      
   * @param {[type]} ...extraParameters pass any parameters to callback function
   */
  trigger(eventName, ...extraParameters) {
    if (!this.events[eventName]) {
      return;
    }

    const l = this.events[eventName].length;
    if (!l) {
      return;
    }

    for (let i = 0; i < l; i += 1) {
      this.events[eventName][i].apply(this, [].slice.call(arguments, 1));
    }
  }

  destroy() {
    this.events = {};
  }
}
