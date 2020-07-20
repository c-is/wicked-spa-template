import $ from 'jquery'
import { gsap } from 'gsap'
import Hanlder from '@app/app/Handler'

import { browserDetect } from '@app/utils/global'
import { getGlobalAll } from '@app/factories/registry'

const { h, doc } = getGlobalAll()


export default class Scroll extends Hanlder {
  static update() {
    window.removeEventListener('scroll', Scroll.onScrollBound)
    Scroll.cache = {}
    return new Scroll()
  }

  constructor(props) {
    super(props)
    this.cache = {}
    this.onScrollBound = this.onScroll.bind(this)
  }

  render() {
    window.addEventListener('scroll', this.onScrollBound)
    return this.saveAnimationCache()
  }

  destroy(events) {
    super.destroy()
    window.removeEventListener('scroll', this.onScrollBound)

    this.cache = {}

    if (events) {
      for (let i = 0; i < events.length; i += 1) {
        window.removeEventListener('scroll', events[i])
      }
    }
  }

  scrollInit() {
    this.updateScrollPosition()
    this.onScrollAnim()
  }

  updateScrollPosition() {
    return this.saveAnimationCache()
  }

  saveAnimationCache() {
    return new Promise(resolve => {
      const animations = []
      const isMobile = browserDetect().mobile

      $('[data-animation]').each((i, element) => {
        const $el = $(element)
        const hasMobile = isMobile && element.dataset.animationMobile

        animations.push({
          el: element,
          $el,
          start: element.dataset.start || 0.1,
          y: $el.offset().top,
          height: element.clientHeight,
          done: element.classList.contains('is-passed'),
          ease: element.dataset.ease || null,
          delay: element.dataset.delay || null,
          timing: element.dataset.timing || null,
          type: hasMobile
            ? element.dataset.animationMobile
            : element.dataset.animation,
        })
      })

      const parallaxes = []
      $('[data-parallax]').each((i, element) => {
        const $el = $(element)
        let parallax = Number(element.dataset.parallax)
        const parallaxNumber = Number(parallax)
        parallax = isNaN(parallaxNumber) ? parallax : parallaxNumber

        parallaxes.push({
          $el,
          start: 0,
          y: $el.offset().top,
          height: element.clientHeight,
          type: typeof parallax === 'string' ? parallax : null,
          shift: typeof parallax === 'number' ? parallax : null,
          done: false,
        })
      })

      this.cache.animations = animations
      this.cache.parallaxes = parallaxes

      resolve()
    })
  }

  onScroll() {
    this.onScrollAnim()
    this.onScrollParallax()
  }

  onScrollAnim() {
    const st = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)

    if (this.cache.animations && this.cache.animations.length > 0) {
      for (let i = 0; i < this.cache.animations.length; i += 1) {
        const item = this.cache.animations[i]
        const itemY = !this.ignoreCache ? item.y : $(item.el).offset().top
        const yBottom = st + ((1 - item.start) * h)
        const itemHeight = !this.ignoreCache ? item.height : item.el.clientHeight

        if (!item.done && itemY <= yBottom && itemY + itemHeight >= st) {
          item.el.classList.add('is-passed')
          this.animation(item)
          item.done = true
        }
      }
    }
  }

  onScrollParallax() {
    const st = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)

    if (this.cache.parallaxes && this.cache.parallaxes.length > 0) {
      for (let i = 0; i < this.cache.parallaxes.length; i += 1) {
        this.parallax(this.cache.parallaxes[i], st, h)
      }
    }
  }

  animation = item => {
    const timing = item.timing ? Number(item.timing) : 0.6
    const delay = item.delay ? Number(item.delay) : 0.1
    const ease = item.ease || 'sine.out'

    switch (item.type) {
      case 'fadeIn':
        gsap.killTweensOf(item.el, { opacity: true })

        gsap.fromTo(
          item.el,
          timing,
          { opacity: 0 },
          {
            opacity: 1,
            ease,
            delay,
          },
        )

        break

      case 'fadeUp':
        gsap.killTweensOf(item.el, { opacity: true, y: true })

        gsap.fromTo(
          item.el,
          timing,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            ease,
            delay,
          },
        )

        break

      case 'fadeDown':
        gsap.killTweensOf(item.el, { opacity: true, y: true })

        gsap.fromTo(
          item.el,
          timing,
          {
            opacity: 0,
            y: -40,
          },
          {
            opacity: 1,
            y: 0,
            ease,
            delay,
          },
        )

        break

      case 'fadeRight':
        gsap.killTweensOf(item.el, { opacity: true, x: true })

        gsap.fromTo(
          item.el,
          timing,
          {
            opacity: 0,
            x: 40,
          },
          {
            opacity: 1,
            x: 0,
            ease,
            delay,
          },
        )

        break

      case 'fadeLeft':
        gsap.killTweensOf(item.el, { opacity: true, x: true })

        gsap.fromTo(
          item.el,
          timing,
          {
            opacity: 0,
            x: -40,
          },
          {
            opacity: 1,
            x: 0,
            ease,
            delay,
          },
        )

        break

      case 'grow':
        gsap.killTweensOf(item.el, { opacity: true, y: true })
        gsap.fromTo(
          item.el,
          timing,
          {
            y: 40,
            css: { scaleY: 0, opacity: 0 },
          },
          {
            css: { scaleY: 1, opacity: 1 },
            y: 0,
            ease: 'sine.out',
            delay,
          },
        )

        break

      case 'growX':
        gsap.killTweensOf(item.el, { opacity: true, x: true })

        gsap.fromTo(
          item.el,
          timing,
          {
            x: 40,
            css: { scaleX: 0, opacity: 0 },
          },
          {
            css: { scaleX: 1, opacity: 1 },
            x: 0,
            ease: 'sine.out',
            delay,
          },
        )

        break

      case 'draw': {
        const paths = item.el.querySelectorAll('path')
        gsap.killTweensOf(item.el, { opacity: true })
        gsap.set(item.el, { oapcity: 1 })

        paths.forEach(path => {
          const length = path.getTotalLength()
          // gsap.killTweensOf(path, { opacity: true, x: true })

          gsap.fromTo(
            path,
            timing,
            {
              strokeDashoffset: length,
              strokeDasharray: length,
            },
            {
              strokeDashoffset: 0,
              ease: 'sine.out',
              delay,
            },
          )
        })
      }

        break

      default:
        console.warn(`animation type "${item.type}"" does not exist`)
        break
    }

    // item.el.classList.add('is-animated')
  }

  parallax = (item, sT, windowHeight, headerHeight = 0) => {
    if (item.shift) {
      const { $el } = item
      let { y } = item

      const pyBottom = sT + (1 - item.start) * windowHeight
      const pyTop = sT - item.height

      if (y >= (pyTop + headerHeight) && y <= pyBottom) {
        const percent = (
          y - sT + item.height - headerHeight
        ) / (
          windowHeight + item.height - headerHeight
        )

        y = Math.round(percent * item.shift)

        const time = !item.done ? 0 : 0.5
        item.done = true

        gsap.killTweensOf($el)

        gsap.to($el, time, {
          y,
          roundProps: ['y'],
          // ease: 'sine.out',
        })
      }
    } else if (item.type) {
      switch (item.type) {
        case 'shape':
          gsap.set(item.$el, {
            y: !browserDetect().mobile ? sT * 0.5 : 0,
          })
          break

        default:
          console.warn(`parallax type "${item.type}" does not exist`)
          break
      }
    }
  }
}
