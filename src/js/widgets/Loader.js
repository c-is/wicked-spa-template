import { gsap } from 'gsap'

const TIMING_OUT = 1.2

export default class Loader {
  onProgress = amount => {
    let val = amount || 100
    val = (amount >= 100) ? 100 : amount

    gsap.killTweensOf('.js-loader-line', { width: true })
    gsap.to('.js-loader-line', 0.3, { width: `${val}%` })
  }

  async onLeave() {
    gsap.killTweensOf('.js-loader-line', { width: true })
    gsap.to('.js-loader-line', TIMING_OUT, { width: '100%', ease: 'circ.out' })

    await gsap.to('.js-loader', TIMING_OUT, {
      autoAlpha: 0,
      ease: 'circ.in',
      delay: 0.8,
    })

    this.reset()
  }

  reset = () => {
    const count = document.querySelector('.js-loader-count')

    if (count) {
      count.textContent = '0'
    }

    gsap.set('.js-loader-image', { rotation: 0 })
    gsap.set('.js-loader-line', { width: '0%' })
  }

  enter = () => {
    document.body.classList.remove('is-load-completed')
    return document.body.classList.add('is-load-start')
  }

  async leave(isNoAnim) {
    const handler = isNoAnim
      ? Promise.resolve()
      : this.onLeave()

    await handler
    document.body.classList.remove('is-load-start')
    document.body.classList.add('is-load-completed')
  }
}
