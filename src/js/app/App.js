import $ from 'jquery'
import { gsap } from 'gsap'

import {
  Scroll,
  Animations,
  Loader,
  Overlay,
  Preload,
  Menu,
  Cursor,
} from '@app/widgets'

import * as Components from '@app/components'
import ClassFactory from '@app/factories/class-factory'

import {
  registerStatus,
  registerStatusAll,
  registerWidget,
  registerComponent,
  getStatusAll,
  getWidget,
  getWidgetAll,
  getGlobal,
} from '@app/factories/registry'

import {
  setCurrentLink,
  browserDetect,
  setBrowserDetect,
} from '@app/utils/global'

import Trigger from './Trigger'
import getParams from './helper'

// import history from '../history'

const { __DEV__ } = process.env
const doc = getGlobal('doc')
const classFactory = new ClassFactory()


export default class Page {
  constructor() {
    this.$view = $('.main');
    [this.view] = this.$view
    this.container = null
    this.components = []
    this.templates = []
    this.page = null
    this.isTransitionStart = false

    this.trigger = new Trigger()
    this.loader = new Loader()
    this.scroll = new Scroll()
    this.animations = new Animations()
    this.overlay = new Overlay()
    this.preload = new Preload()
    this.menu = new Menu()
    this.cursor = new Cursor()

    this.resizeBound = this.resize.bind(this)
    this.backHandlerBound = this.backHandler.bind(this)
    this.pageTransitionBound = this.pageTransition.bind(this)

    this.register()
  }

  init() {
    const current = window.location.pathname
    const pageConfig = {
      href: current,
      slug: current.replace(/\//g, ''),
    }

    setBrowserDetect()

    gsap.set(window, { scrollTo: 0 })
    this.events()

    this.preload.onPreload()
      .then(() => this.setPage(pageConfig))
      .then(() => this.loader.leave())
      .then(() => this.scroll.onScrollAnim())

    this.trigger.setHistory()
  }

  events() {
    $(document).on('click', '.js-ajax-trigger', this.pageTransitionBound)
    $(document).on('click', '.js-scroller', this.scroller)
    $(document).on('click', '.js-back', this.backPrevious)
    $(window).on('popstate', this.backHandlerBound)
    $(window).on('resize', this.resizeBound)
  }

  register() {
    registerStatus('view', this.view)

    registerWidget('Loader', this.loader)
    registerWidget('Scroll', this.scroll)
    registerWidget('Animations', this.animations)
    registerWidget('Overlay', this.overlay)
    registerWidget('Preload', this.preload)
    registerWidget('Menu', this.menu)
    registerWidget('Cursor', this.cursor)
  }

  updateSize = () => {
    if (browserDetect().mobile) {
      gsap.set('.js-full-height', { height: window.innerHeight })
      gsap.set('.js-top-height', { height: window.innerHeight - window.innerWidth })
    }
  }

  backPrevious = event => {
    event.preventDefault()
    window.history.back()
  }

  backHandler(event) {
    if (window.history.length > 2 || document.referrer.length > 0) {
      this.pageTransition(event, true)
    }
  }

  scroller = event => {
    event.preventDefault()
    const target = event.currentTarget.dataset.to
    const scrollTo = target === 'top' ? 0 : $(target).offset().top
    gsap.to(window, 1.6, { scrollTo, ease: 'circ.easeInOut' })
  }

  scrollTo = position => (
    new Promise(resolve => {
      $('html, body').animate({ scrollTop: position }, 600, () => {
        resolve()
      })
    })
  )

  async getPage(params) {
    const nameSpace = this.view.dataset.namespace
    const transition = this.pageTransitionBound
    const props = { transition, params, nameSpace }

    classFactory.setPageClass(this.$view)

    this.page = await classFactory.getPageInstance(this.$view, nameSpace)
      .then(PageComponent => new PageComponent.default(this.$view, props))

    console.log(`${nameSpace} page rendered!`)
    return this.page.render()
  }

  loadComponent($container = this.$view) {
    const $components = $container.find('[data-component]')

    for (let i = $components.length - 1; i >= 0; i -= 1) {
      const $component = $components.eq(i)
      const componentName = $component.data('component')

      if (Components[componentName] !== undefined) {
        const options = $component.data('options')
        const component = new Components[componentName]($component, options)

        registerComponent(componentName, component)
        this.components.push(component)
      } else {
        window.console.warn('There is no "%s" component!', componentName)
      }
    }
  }

  async setPage(props, update = false) {
    const {
      datasets,
      slug,
      href,
      pagePosition = 0,
      isLoaded = true,
    } = props

    const isMobile = browserDetect().mobile
    let isAjaxActive = false

    if (isMobile) {
      this.$view = $('.main')
    } else {
      this.$view = update ? $('.new-wrapper .main') : $('.main')
    }

    [this.view] = this.$view
    this.setAnalytics(slug)
    this.updateSize()

    if (update) {
      isAjaxActive = true
      this.scroll = Scroll.update()
      this.register()
    }

    await this.getPage(datasets)
    this.loadComponent()

    setCurrentLink(href)

    registerStatusAll({
      slug,
      isLoaded,
      isAjaxActive,
      pagePosition,
    })

    this.cursor.resetElements()
    await this.callLoaded()
    await this.scroll.render()
    this.scroll.onScrollParallax()
  }

  async pageTransition(event, back, custom = {}) {
    if (event) {
      event.preventDefault()
    }

    if (this.isTransitionStart) {
      return
    }

    this.isTransitionStart = true
    const currentPosition = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
    const { slug, pagePosition, isMenuOpen } = getStatusAll()

    const params = getParams({
      event,
      back,
      custom,
      currentPosition,
      prevPosition: pagePosition,
      prevHref: window.history.state ? window.history.state.href : null,
    })

    const {
      nextSlug,
      nextHref,
      position,
      type,
      dataset,
    } = params

    const isBack = back && !custom.href
    const isSameUrl = slug === nextSlug && !isBack

    const pageParams = {
      href: nextHref,
      pagePosition: position,
      datasets: dataset,
      slug: nextSlug,
    }

    const pageProps = {
      params: pageParams,
      back,
      position,
    }

    if (isSameUrl) {
      this.isTransitionStart = false
      return
    }

    if (isMenuOpen) {
      const menu = getWidget('Menu')
      if (menu) {
        await menu.handleClose(true)
      }
    }

    this.overlay.create()
    this.loader.enter()
    if (!isBack) Trigger.setHistory(nextHref)

    await this.trigger.load()
    await this.trigger.onLinkClick(event, type)

    this.destroy()

    await this.renderNewPage(pageProps)

    this.isTransitionStart = false
  }

  async renderNewPage({
    params,
    back,
    position,
    skipAnim,
  }) {
    const container = this.trigger.render()
    registerStatus('view', container)

    await this.preload.onPreload()
    await this.setPage(params, true)

    await this.loader.leave(true)
    this.overlay.destroy()
    this.callLoaded()
    gsap.set(window, { scrollTo: 0 })

    await this.animations.enter({
      element: container,
      skipAnim,
    })

    this.isTransitionStart = false
    this.scroll.scrollInit()

    if (back) {
      await this.scrollTo(position)
    }

    return Promise.resolve()
  }

  onState() {
    let changed = false

    for (const component of this.components) {
      const componentChanged = component.onState()
      if (!changed && !!componentChanged) {
        changed = true
      }
    }

    return changed
  }

  turnOff() {
    this.callAll('turnOff')
  }

  turnOn() {
    this.callAll('turnOn')
  }

  async callLoaded(...args) {
    if (typeof this.page.loaded === 'function') {
      this.page.loaded(...[].slice.call(args, 1))
    }
  }

  resize() {
    const widgets = getWidgetAll()
    const entries = Object.entries(widgets)

    for (const [, widget = {}] of entries) {
      if (typeof widget.resize === 'function') {
        widget.resize(...[].slice.call([], 1))
      }
    }

    this.callAll('resize')
  }

  callAll(fn, ...args) {
    /* eslint no-restricted-syntax: ['error', 'WithStatement', 'BinaryExpression[operator="in"]'] */
    for (const component of this.components) {
      if (typeof component[fn] === 'function') {
        component[fn](...[].slice.call(args, 1))
      }
    }

    if (typeof this.page[fn] === 'function') {
      this.page[fn](...[].slice.call(args, 1))
    }
  }

  destroy() {
    this.callAll('destroy')
    this.scroll.destroy()
    this.animations.destroy()
    this.components = []
    this.templates = []

    gsap.killTweensOf(this.view)

    this.$view.off()
    this.$view = null
  }

  setAnalytics = pathname => {
    if (window.ga && !__DEV__) window.ga('send', 'pageview', pathname)
  }
}
