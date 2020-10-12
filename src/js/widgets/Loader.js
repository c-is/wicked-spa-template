import { gsap } from 'gsap';

const TIMING_OUT = 0.8;

export default class Loader {
  constructor() {
    this.onLeave = this.onLeave.bind(this);
  }

  onProgress = amount => {
    let val = amount || 100;
    val = (amount >= 100) ? 100 : amount;

    // gsap.killTweensOf('.js-loader-line', { width: true })
    // gsap.to('.js-loader-line', 0.3, { width: `${val}%` })
  }

  async onLeave() {
    // gsap.killTweensOf('.js-loader-line', { width: true })

    // gsap.to('.js-loader-line', TIMING_OUT, {
    //   width: '100%',
    //   ease: 'circ.out',
    // })

    await gsap.to('.js-loader', TIMING_OUT, {
      autoAlpha: 0,
      ease: 'circ.in',
      // delay: 0.8,
    });

    this.reset();
  }

  reset = () => {
    const count = document.querySelector('.js-loader-count');

    if (count) {
      count.textContent = '0';
    }

    gsap.set('.js-loader-image', { rotation: 0 });
    // gsap.set('.js-loader-line', { width: '0%' })
  }

  enter = () => {
    const content = document.querySelector('.content');
    const footer = document.querySelector('.footer');
    const loader = document.querySelector('.js-loader');
    document.body.classList.remove('is-load-completed');
    document.body.classList.add('is-load-start');

    const tl = gsap.timeline();
    return new Promise(resolve => {
      tl.to(content, 0.6, { y: -80, opacity: 0 }, 'out')
        .to(footer, 0.6, { y: 80, opacity: 0 }, 'out')
        .add('out')
        .add(() => { window.scrollTo(0, 0); })
        .set(loader, { visibility: 'visible' })
        .to(loader, 0.6, { opacity: 1 })
        .add(() => {
          resolve();
        });
    });
  }

  async leave(isNoAnim) {
    const handler = isNoAnim
      ? Promise.resolve()
      : this.onLeave();

    await handler;
    document.body.classList.remove('is-load-start');
    document.body.classList.add('is-load-completed');
  }
}
