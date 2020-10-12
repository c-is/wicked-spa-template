import { gsap } from 'gsap';
import { TRANSITION_EASE } from '@app/constants';


export default class Animations {
  leave = async view => {
    document.body.classList.add('is-load-start');
    document.body.classList.remove('is-load-completed');
    await gsap.to([view, '.footer'], 0.6, { opacity: 0, ease: TRANSITION_EASE });
  }

  enter = async (view, options = {}) => {
    gsap.killTweensOf(view);
    await gsap.to([view, '.footer'], options.skipAnim ? 0.4 : 1, { opacity: 1 });
    gsap.set(view, { clearProps: 'all' });
    document.body.classList.remove('is-load-start');
    document.body.classList.add('is-load-completed');
  }

  destroy = () => {
  }
}
