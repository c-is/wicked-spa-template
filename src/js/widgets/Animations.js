import { gsap } from 'gsap'
// import { browserDetect } from '../app/globals'
import { TRANSITION_EASE, TRANSITION_TIMING, getColours } from '@app/constants'


// const TIMING_IN = 0.4
// const BG_TIMING_OUT = 1.2
// const BG_TIMING_IN = 1.2


export default class Animations {
  tilt = null

  bg = {
    base: document.querySelector('.js-bg'),
    innerLeft: document.querySelector('.js-bg-inner--left'),
    innerRight: document.querySelector('.js-bg-inner--right'),
  }

  tiltEl = {
    base: document.querySelectorAll('.js-tilt'),
    image: document.querySelectorAll('.js-tilt-image'),
  }

  tiltInit() {
    this.tiltEl = {
      base: document.querySelectorAll('.js-tilt'),
      image: document.querySelectorAll('.js-tilt-image'),
    }

    this.tilt = VanillaTilt.init(this.tiltEl.base)
    this.tiltImage = VanillaTilt.init(this.tiltEl.image, { max: 3 })
  }

  leave = view => {
    const ease = TRANSITION_EASE
    return gsap.to(view, 0.4, { opacity: 0, ease })
  }

  enter = async ({ element, skipAnim }) => {
    gsap.killTweensOf(element)
    await gsap.to(element, skipAnim ? 0.4 : 0.6, { opacity: 1 })
    gsap.set(element, { clearProps: 'all' })
  }

  destroy = () => {
    this.tilt = null
    this.tiltImage = null
  }
}
