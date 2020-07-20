import { gsap } from 'gsap'

import { registerStatus, getStatus } from '@app/factories/registry'
import { browserDetect } from '@app/utils/global'

import { TRANSITION_EASE } from '@app/constants'

const isMobile = browserDetect().mobile
const TIMING = 0.6
const BG_TIMING_OUT = isMobile ? 0.8 : 1
const BG_TIMING_IN = isMobile ? 0.4 : 0.8


export default class Menu {
  trigger = document.querySelector('.js-menu-trigger')

  navigation = document.querySelector('#navigation')

  items = []

  constructor() {
    this.view = document.querySelector('.js-menu')
    this.overlay = this.view.querySelector('.js-menu-overlay')

    this.handleClickBound = this.handleClick.bind(this)
    this.init()
  }

  async handleClose() {
    this.isLoading = true
    registerStatus('isMenuOpen', false)
    this.view.classList.remove('is-loaded')
    this.trigger.classList.remove('is-active', 'is-loaded')
    document.body.classList.remove('is-menu-opened')

    await gsap.to(this.overlay, BG_TIMING_OUT, {
      width: 0,
      ease: TRANSITION_EASE,
    })

    gsap.to(this.navigation, 0.4, { autoAlpha: 1 })
    gsap.set(this.overlay, { clearProps: 'all' })
    this.view.classList.remove('is-active')

    this.isLoading = false
  }

  async handleOpen() {
    this.isLoading = true

    if (isMobile) {
      gsap.set(this.view, { width: window.innerWidth })
    }

    this.view.classList.add('is-active')
    this.trigger.classList.add('is-active', 'is-loaded')
    document.body.classList.add('is-menu-opened')

    gsap.to(this.navigation, 0.4, { autoAlpha: 0 })

    await gsap.to(this.overlay, BG_TIMING_IN, {
      width: window.innerWidth,
      ease: TRANSITION_EASE,
    })

    this.view.classList.add('is-loaded')

    registerStatus('isMenuOpen', true)
    this.isLoading = false
  }

  handleClick(event) {
    event.preventDefault()
    const isActive = getStatus('isMenuOpen')

    if (this.isLoading) {
      return
    }

    if (isActive) {
      this.handleClose()
    } else {
      this.handleOpen()
    }
  }

  resize() {
    gsap.set(this.overlay, { width: window.innerWidth })
  }

  destroy = () => {
  }

  events() {
    this.trigger.addEventListener('click', this.handleClickBound)
  }

  init() {
    this.events()
  }
}
