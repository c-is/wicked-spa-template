import $ from 'jquery';
import { TweenMax, Sine } from 'gsap';

const TIMING_IN = 1;
const TIMING_OUT = 0.4;


export default class Loader {
  constructor() {
    this.$view = $('.main');
  }

  loaderIn = () => {
    TweenMax.set('.loader__image', { rotation: 0 });
    return new Promise((resolve) => {
      TweenMax.to('.loader', 0.5, {
        autoAlpha: 1,
        rotationZ: 0,
        x: '0%',
        height: '100%',
        delay: 0.2,
        ease: Sine.easeOut,
        onComplete: () => {
          resolve();
        },
      });
    });
  };

  loaderOut = (amount) => {
    let val = amount || 90;
    val = (amount >= 90) ? 90 : amount;

    return new Promise((resolve) => {
      TweenMax.killTweensOf('.loader__image');
      TweenMax.to('.loader__image', TIMING_OUT, {
        rotation: val,
        ease: Sine.easeOut,
        delay: 0.15,
        onComplete: () => {
          if (val >= 90) {
            TweenMax.to('.loader', 0.6, {
              autoAlpha: 0,
              rotationZ: 90,
              x: '140%',
              height: '140%',
              ease: Sine.easeIn,
              delay: 0.45,
              onComplete: () => {
                resolve();
              },
            });
          }
        },
      });

      TweenMax.to('.footer, .header', TIMING_IN, { y: '0%', opacity: 1, delay: 1 });
    });
  };

  loaderSet = () => {
    TweenMax.set('.loader', { x: '-2%', rotationZ: 0 });
  };
}
