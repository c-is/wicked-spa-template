import $ from 'jquery';
import { TweenMax, Sine } from 'gsap';
import classie from 'classie';
import Hanlder from './Handler';

export default class Scroll extends Hanlder {
  static destroyScroll(events) {
    $(window).off('scroll');

    Scroll.cache = {};
    Scroll.scroll = null;

    if (events) {
      for (let i = 0; i < events.length; i += 1) {
        $(window).off('scroll', events[i]);
      }
    }
  }

  static updateScroll() {
    Scroll.scroll = new Scroll();
  }

  constructor(props) {
    super(props);
    this.cache = {};
    this.render();
  }

  render() {
    this.saveAnimationCache();
    $(window).on('scroll', this.onScroll);
  }

  saveAnimationCache() {
    const animations = [];
    $('[data-animation]').each((i, element) => {
      const $el = $(element);
      animations.push({
        el: element,
        start: $el.data('start') || 0.1,
        y: $el.offset().top,
        height: $el.height(),
        done: $el.hasClass('is-passed'),
        type: $el.data('animation'),
        delay: $el.data('delay') || null,
        timing: $el.data('timing') || null,
      });
    });

    this.cache.animations = animations;
    this.onScroll();
  }

  pageBottom = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      $('.footer, .js-article-close').addClass('is-active');
    } else {
      $('.footer, .js-article-close').removeClass('is-active');
    }
  }

  onScroll = () => {
    const st = $(window).scrollTop();

    if (this.cache.animations && this.cache.animations.length > 0) {
      for (let i = 0; i < this.cache.animations.length; i += 1) {
        const item = this.cache.animations[i];
        const itemY = !this.ignoreCache ? item.y + $('.header').height() : $(item.el).offset().top + $('.header').height();
        const yBottom = st + ((1 - item.start) * window.innerHeight);
        const itemHeight = !this.ignoreCache ? item.height : $(item.el).height();

        if (!item.done && itemY <= yBottom && itemY + itemHeight >= st) {
          classie.add(item.el, 'is-passed');
          this.animation(item);
          item.done = true;
        }
      }
    }

    this.pageBottom();
  }

  animation = (item) => {
    const timing = item.timing || 1;
    const delay = item.delay || 0.1;

    switch (item.type) {
      case 'fadeUp':
        TweenMax.killTweensOf(item.el, { opacity: true, y: true });
        TweenMax.fromTo(
          item.el,
          timing,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            ease: Sine.easeOut,
            delay,
          },
        );
        break;

      case 'fadeRight':
        TweenMax.killTweensOf(item.el, { opacity: true, x: true });
        TweenMax.fromTo(
          item.el,
          timing,
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            ease: Sine.easeOut,
            delay,
          },
        );
        classie.add(item.el, 'is-animated');

        break;

      case 'fadeLeft':
        TweenMax.killTweensOf(item.el, { opacity: true, x: true });
        TweenMax.fromTo(
          item.el,
          timing,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            ease: Sine.easeOut,
            delay,
          },
        );
        classie.add(item.el, 'is-animated');

        break;

      case 'fadeRollIn':
        TweenMax.killTweensOf(item.el, { opacity: true, rotation: true, x: true });
        TweenMax.fromTo(
          item.el,
          timing,
          {
            opacity: 0, x: '15%', y: '5%', rotationZ: 10,
          },
          {
            opacity: 1,
            rotationZ: 0,
            x: '0%',
            y: '0%',
            ease: Sine.easeOut,
            delay,
          },
        );
        classie.add(item.el, 'is-animated');
        break;

      case 'grow':
        TweenMax.killTweensOf(item.el, { opacity: true, scale: true, y: true });
        TweenMax.fromTo(
          item.el,
          timing,
          { opacity: 0, scale: 1.1, y: -100 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            ease: Sine.easeOut,
            delay,
          },
        );
        classie.add(item.el, 'is-animated');
        break;

      default:
        console.warn(`animation type "${item.type}"" does not exist`);
        break;
    }
  }
}
