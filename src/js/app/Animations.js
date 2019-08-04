import $ from 'jquery';
import { TweenMax } from 'gsap';
import 'gsap/ScrollToPlugin';
import Trigger from './Trigger';

const TIMING_IN = 1;
const TIMING_OUT = 0.4;

export default class Animations {
  animateOut = () => {
    const scrollPos = $(window).scrollTop();
    const contentHeight = $(Trigger.CONTENT_SELECTOR).offset().top;
    const dir = (scrollPos > (contentHeight / 2)) ? 100 : -100;

    return new Promise((resolve) => {
      TweenMax.to('.header', TIMING_OUT, { y: '-100%' });
      TweenMax.to('.footer', TIMING_OUT, { y: '100%', opacity: 0 });

      $('body').removeClass('load-completed');

      TweenMax.to(Trigger.CONTENT_SELECTOR, 0.8, {
        opacity: 0,
        y: dir,
        onComplete: () => {
          TweenMax.set(window, { scrollTo: 0 });
          resolve();
        },
      });
    });
  }

  animateIn = (backTo) => {
    if (backTo) {
      TweenMax.to(Trigger.CONTENT_SELECTOR, 0.2, {
        y: 0,
        onComplete: () => {
          TweenMax.set(window, { scrollTo: Trigger.pagePosition() });
          TweenMax.to(Trigger.CONTENT_SELECTOR, TIMING_IN, { opacity: 1, delay: 0.4 });
        },
      });
    } else {
      TweenMax.fromTo(Trigger.CONTENT_SELECTOR, TIMING_IN, {
        opacity: 0,
        y: 0,
      }, {
        opacity: 1,
        delay: 0.4,
        onComplete: () => {
          $(Trigger.CONTENT_SELECTOR).css('transform', '');
        },
      });
    }
  }
}
