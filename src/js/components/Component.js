import Handler from '@app/app/Handler'

export default class Component extends Handler {
  constructor() {
    super()
  }

  preloadImages() {
    return []
  }

  setState(state) {
    return new Promise((resolve) => {

    })
  }

  onState() {
    return false
  }

  animateIn(index, delay) {

  }

  animateOut() {
    return Promise.resolve(true)
  }

  turnOff() { }

  turnOn() { }

  resize(wdt, hgt) { }

  resetElements() {
    
  }

  destroy() {
    super.destroy()
  }
}
