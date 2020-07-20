import $ from 'jquery'
import { gsap } from 'gsap'
import Hammer from 'hammerjs'
import { browserDetect } from '@app/utils/global'
import { getWidget } from '@app/factories/registry'
import Component from '../Component'

const isMobile = browserDetect().mobile

export default class ImageModal extends Component {
  constructor($view) {
    super($view)

    this.$view = $view;
    [this.view] = $view

    this.el = null
    this.hammer = null
    this.nav = {}
    this.imageId = 0
    this.images = []
    this.image = null
    this.cursor = null
    this.overlay = null
    this.buttonClose = null
    this.isActivated = false

    this.closeBound = this.close.bind(this)
    this.activateBound = this.activate.bind(this)
    this.swipeEventsBound = this.swipeEvents.bind(this)
    this.handleNavBound = this.handleNav.bind(this)

    this.init()
  }

  init() {
    this.setImageCache()
    this.events()
  }

  events() {
    const modalHandlers = this.view.querySelectorAll('.js-image-modal')
    for (let i = modalHandlers.length - 1; i >= 0; i -= 1) {
      modalHandlers[i].addEventListener('click', this.activateBound)
    }
  }

  destroy() {
    if (this.el) {
      document.body.removeChild(this.el)
      document.body.classList.remove('is-modal')

      if (this.nav.left) {
        this.nav.left.removeEventListener('click', this.handleNavBound)
        this.nav.right.removeEventListener('click', this.handleNavBound)
        this.nav = {}
      }

      if (this.hammer) {
        this.hammer.destroy()
        this.hammer = null
      }

      this.el.removeEventListener('click', this.closeBound)
      this.view.removeEventListener('click', this.activateBound)

      this.el = null
      this.cursor = null
      this.overlay = null
      this.image = null
    }
  }

  setImageCache() {
    const images = this.view.querySelectorAll('.js-image-modal')

    if (images && images.length > 0) {
      images.forEach(element => {
        const image = element.dataset.src
        this.images.push(image)
      })
    }
  }

  hammerInit(view) {
    this.hammer = new Hammer.Manager(view)
    const swipe = new Hammer.Swipe()

    this.hammer.add(swipe)
    this.hammer.on('swipeleft', this.swipeEventsBound)
    this.hammer.on('swiperight', this.swipeEventsBound)
  }

  swipeEvents(e) {
    const number = e.type === 'swipeleft' ? 1 : -1
    const data = this.images[this.imageId + number]

    if (data) {
      this.imageId = this.imageId + number
      this.setImage(data)
    }
  }

  displayNav(imageId) {
    const isFirst = imageId === 0
    const isLast = imageId === this.images.length - 1

    if (isFirst) {
      this.nav.left.classList.add('is-hide')
    } else {
      this.nav.left.classList.remove('is-hide')
    }

    if (isLast) {
      this.nav.right.classList.add('is-hide')
    } else {
      this.nav.right.classList.remove('is-hide')
    }
  }

  handleNav(event) {
    const { type } = event.currentTarget.dataset
    const number = type === 'prev' ? -1 : 1
    const comingId = this.imageId + number
    const data = this.images[comingId]

    this.displayNav(comingId)

    if (data) {
      this.imageId = comingId
      this.setImage(data)
    }
  }

  loadImage = (src, image) => (
    new Promise(resolve => {
      const $image = $(`<img src="${src}" />`)

      $image.on('load', () => {
        image.setAttribute('src', src)
        resolve()
      })
    })
  )

  async setImage(data) {
    const image = this.el.querySelector('img')
    await gsap.to(image, 0.4, { opacity: 0 })
    await this.loadImage(data, image)

    gsap.to(image, 0.4, {
      opacity: 1,
      delay: 0.2,
    })
  }

  show() {
    return gsap.to(this.el, 0.4, { autoAlpha: 1 })
  }

  showCloseButtonMobile = () => {
    if (isMobile) {
      this.createCloseButton()
    }
  }

  async showNavMobile() {
    const selector = [this.nav.left, this.nav.right]

    if (isMobile && !this.isActivated) {
      this.isActivated = true

      await gsap.to(selector, 0.5, {
        autoAlpha: 1,
        delay: 0.2,
      })

      gsap.to(selector, 0.6, {
        autoAlpha: 0,
        delay: 0.3,
      })
    }
  }

  createCloseButton() {
    const button = document.createElement('span')
    button.className = 'modal__button'
    button.addEventListener('click', this.closeBound)
    this.el.appendChild(button)
  }

  createNav() {
    const left = document.createElement('span')
    const right = document.createElement('span')
    left.className = 'modal__nav modal__nav--left js-button-standard'
    right.className = 'modal__nav modal__nav--right js-button-standard'
    left.dataset.type = 'prev'
    right.dataset.type = 'next'
    left.addEventListener('click', this.handleNavBound)
    right.addEventListener('click', this.handleNavBound)
    this.nav = { left, right }
    this.el.appendChild(left)
    this.el.appendChild(right)
    this.displayNav(this.imageId)
  }

  createOverlay = () => {
    const overlay = document.createElement('div')
    overlay.className = 'modal__overlay js-button-cross'
    overlay.addEventListener('click', this.closeBound)
    // overlay.addEventListener('mouseenter', this.handleCursor)
    return overlay
  }

  createImage(dataset) {
    const { src } = dataset
    const image = document.createElement('img')
    image.setAttribute('src', src)
    image.classList.add('js-button-cross')
    image.addEventListener('click', this.closeBound)
    return image
  }

  async close() {
    await gsap.to(this.el, 0.4, { autoAlpha: 0 })
    this.cursor.crossOff()
    this.destroy()
  }

  createModalElement({ image, overlay, isHammer }) {
    this.el = document.createElement('div')
    this.el.className = 'modal'
    this.el.appendChild(image)
    this.el.appendChild(overlay)
    document.body.appendChild(this.el)

    if (isHammer) {
      this.hammerInit(this.el)
    }
  }

  createImageModal({ overlay, target }) {
    this.image = this.createImage(target.dataset)
    this.createModalElement({
      image: this.image,
      isHammer: true,
      overlay,
    })

    if (!this.isActivated) {
      this.createNav()
    }

    if (!this.cursor) {
      this.cursor = getWidget('Cursor')
      this.cursor.resetElements()
    }
  }

  activate(event) {
    event.preventDefault()

    const { imageId, videoId } = event.currentTarget.dataset
    this.imageId = Number(imageId) - 1

    document.body.classList.add('is-modal')
    this.overlay = this.createOverlay()
    this.createImageModal({ overlay: this.overlay, target: event.currentTarget })

    this.show().then(() => {
      this.showCloseButtonMobile()
      this.showNavMobile()
    })
  }
}
