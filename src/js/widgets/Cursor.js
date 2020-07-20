import { gsap } from 'gsap'

import { getGlobalAll } from '@app/factories/registry'
import * as Utils from '@app/utils/utils'
import { browserDetect } from '@app/utils/global'

const { w, h } = getGlobalAll()
const isMobile = browserDetect().mobile


export default class Cursor {
  constructor() {
    this.cursor = document.body.querySelector('.js-cursor')

    this.hoverElementsSelector = '.js-button-standard, [data-cursorSize="small"]'
    this.lightElementsSelector = '.js-button-light, [data-theme="dark"]'
    this.arrowElementsSelector = '.js-button-arrows'
    this.crossElementsSelector = '.js-button-cross'
    this.darkElementsSelector = '.js-button-dark, [data-theme="light"]'

    this.currentX = (w / 2)
    this.currentY = (h / 2)

    this.targetX = (w / 2)
    this.targetY = (h / 2)

    // Bindings
    this.resetElementsBound = this.resetElements.bind(this)
    this.getInitialPosBound = this.getInitialPos.bind(this)
    this.getPosBound = this.getPos.bind(this)
    this.setPosBound = this.setPos.bind(this)
    this.hideBound = this.hide.bind(this)
    this.showBound = this.show.bind(this)
    this.growBound = this.grow.bind(this)
    this.shrinkBound = this.shrink.bind(this)
    this.darkBound = this.dark.bind(this)
    this.lightBound = this.light.bind(this)
    this.crossBound = this.cross.bind(this)
    this.crossOffBound = this.crossOff.bind(this)
    this.sliderModeOnBound = this.sliderModeOn.bind(this)
    this.sliderModeOffBound = this.sliderModeOff.bind(this)
    this.sliderDirectionBound = this.sliderDirection.bind(this)

    if (isMobile) {
      this.initMobile()
    } else {
      this.events()
      this.init()
    }
  }

  events() {
    window.addEventListener('mousemove', this.getInitialPosBound)
    document.body.addEventListener('mouseenter', this.showBound)
  }

  initMobile() {
    this.cursor.style.opacity = 0
  }

  init() {
    this.hoverElements = document.body.querySelectorAll(this.hoverElementsSelector)
    this.lightElements = document.body.querySelectorAll(this.lightElementsSelector)
    this.arrowElements = document.body.querySelectorAll(this.arrowElementsSelector)
    this.crossElements = document.body.querySelectorAll(this.crossElementsSelector)
    this.darkElements = document.body.querySelectorAll(this.darkElementsSelector)

    for (let x = 0; x < this.hoverElements.length; x += 1) {
      this.hoverElements[x].addEventListener('mouseenter', this.growBound)
      this.hoverElements[x].addEventListener('mouseleave', this.shrinkBound)
    }

    for (let x = 0; x < this.lightElements.length; x += 1) {
      this.lightElements[x].addEventListener('mouseenter', this.lightBound)
      this.lightElements[x].addEventListener('mouseleave', this.darkBound)
    }

    for (let x = 0; x < this.arrowElements.length; x += 1) {
      this.arrowElements[x].addEventListener('mouseenter', this.sliderModeOnBound)
      this.arrowElements[x].addEventListener('mouseleave', this.sliderModeOffBound)
    }

    for (let x = 0; x < this.crossElements.length; x += 1) {
      this.crossElements[x].addEventListener('mouseenter', this.crossBound)
      this.crossElements[x].addEventListener('mouseleave', this.crossOffBound)
    }

    for (let x = 0; x < this.darkElements.length; x += 1) {
      this.darkElements[x].addEventListener('mouseenter', this.darkBound)
    }
  }

  destroy() {
    super.destroy()
    this.shrinkBound()

    window.removeEventListener('mousemove', this.getInitialPosBound)
    window.removeEventListener('mousemove', this.getPosBound)
    document.body.removeEventListener('mouseenter', this.showBound)

    for (let x = 0; x < this.hoverElements.length; x += 1) {
      this.hoverElements[x].removeEventListener('mouseenter', this.growBound)
      this.hoverElements[x].removeEventListener('mouseleave', this.shrinkBound)
    }

    for (let x = 0; x < this.lightElements.length; x += 1) {
      this.lightElements[x].removeEventListener('mouseenter', this.lightBound)
      this.lightElements[x].removeEventListener('mouseleave', this.darkBound)
    }

    for (let x = 0; x < this.arrowElements.length; x += 1) {
      this.arrowElements[x].removeEventListener('mouseenter', this.sliderModeOnBound)
      this.arrowElements[x].removeEventListener('mouseleave', this.sliderModeOffBound)
    }

    for (let x = 0; x < this.crossElements.length; x += 1) {
      this.crossElements[x].removeEventListener('mouseenter', this.crossBound)
      this.crossElements[x].removeEventListener('mouseleave', this.crossOffBound)
    }

    for (let x = 0; x < this.darkElements.length; x += 1) {
      this.darkElements[x].removeEventListener('mouseenter', this.darkBound)
    }
  }

  resetElements() {
    if (isMobile) {
      return
    }

    this.darkElements = document.body.querySelectorAll(this.darkElementsSelector)
    this.hoverElements = document.body.querySelectorAll(this.hoverElementsSelector)
    this.crossElements = document.body.querySelectorAll(this.crossElementsSelector)

    for (let x = 0; x < this.hoverElements.length; x += 1) {
      this.hoverElements[x].removeEventListener('mouseenter', this.growBound)
      this.hoverElements[x].removeEventListener('mouseleave', this.shrinkBound)
    }

    for (let x = 0; x < this.lightElements.length; x += 1) {
      this.lightElements[x].removeEventListener('mouseenter', this.lightBound)
      this.lightElements[x].removeEventListener('mouseleave', this.darkBound)
    }

    for (let x = 0; x < this.arrowElements.length; x += 1) {
      this.arrowElements[x].removeEventListener('mouseenter', this.sliderModeOnBound)
      this.arrowElements[x].removeEventListener('mouseleave', this.sliderModeOffBound)
    }

    for (let x = 0; x < this.crossElements.length; x += 1) {
      this.crossElements[x].removeEventListener('mouseenter', this.crossBound)
      this.crossElements[x].removeEventListener('mouseleave', this.crossOffBound)
    }

    for (let x = 0; x < this.darkElements.length; x += 1) {
      this.darkElements[x].removeEventListener('mouseenter', this.darkBound)
    }

    this.init()
  }

  getInitialPos(e) {
    if (w < 1024) return
    window.removeEventListener('mousemove', this.getInitialPosBound)

    this.targetX = e.clientX
    this.targetY = e.clientY
    this.currentX = this.targetX
    this.currentY = this.targetY

    window.requestAnimationFrame(this.setPosBound)
    window.addEventListener('mousemove', this.getPosBound)
  }

  getPos(e) {
    this.targetX = e.clientX
    this.targetY = e.clientY
  }

  setPos() {
    this.currentX += (this.targetX - this.currentX) * 0.5
    this.currentY += (this.targetY - this.currentY) * 0.5
    gsap.set(this.cursor, { x: this.currentX, y: this.currentY })
    window.requestAnimationFrame(this.setPosBound)
  }

  hide() {
    Utils.setAttribute(this.cursor, 'hidden', true)
  }

  show() {
    Utils.setAttribute(this.cursor, 'hidden', false)
  }

  grow(e) {
    // Utils.setAttribute(this.cursor, 'arrows', false)
    Utils.setAttribute(this.cursor, 'expand', true)

    if (e.target.dataset.cursorsize) {
      Utils.setAttribute(this.cursor, 'small', true)
    }
  }

  shrink() {
    // Utils.setAttribute(this.cursor, 'arrows', false)
    Utils.setAttribute(this.cursor, 'expand', false)
    Utils.setAttribute(this.cursor, 'small', false)
  }

  light() {
    // Utils.setAttribute(this.cursor, 'arrows', false)
    Utils.setAttribute(this.cursor, 'light', true)
  }

  dark() {
    // Utils.setAttribute(this.cursor, 'arrows', false)
    Utils.setAttribute(this.cursor, 'light', false)
  }

  cross() {
    Utils.setAttribute(this.cursor, 'arrows', false)
    Utils.setAttribute(this.cursor, 'direction', null)
    Utils.setAttribute(this.cursor, 'cross', true)
    // Utils.setAttribute(this.cursor, 'expand', true)
  }

  crossOff() {
    Utils.setAttribute(this.cursor, 'cross', false)
    // Utils.setAttribute(this.cursor, 'expand', false)
  }

  sliderModeOn(e) {
    const dir = e.target.dataset.direction

    if (dir) {
      Utils.setAttribute(this.cursor, 'direction', dir)
    }

    Utils.setAttribute(this.cursor, 'arrows', true)
  }

  sliderModeOff() {
    Utils.setAttribute(this.cursor, 'direction', null)
    Utils.setAttribute(this.cursor, 'arrows', false)
  }

  sliderDirection(dir = 'both') {
    Utils.setAttribute(this.cursor, 'direction', dir)
  }

  navDirection(dir = 'both') {
    Utils.setAttribute(this.cursor, 'arrows', true)
    Utils.setAttribute(this.cursor, 'direction', dir)
  }

  navDirectionOff() {
    Utils.setAttribute(this.cursor, 'arrows', false)
    Utils.setAttribute(this.cursor, 'direction', null)
  }
}
