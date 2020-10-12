// import { gsap } from 'gsap';
import { getComponent } from '@app/factories/registry';
import DefaultPage from '../DefaultPage';


export default class Home extends DefaultPage {
  constructor($view, props) {
    super($view);

    this.$view = $view;
    [this.view] = $view;
    this.props = props;

    this.workDisplay = this.view.querySelector('.js-work-display');
    this.workImage = this.view.querySelector('.js-work-image');
    this.workText = this.view.querySelector('.js-work-text');
    this.displayTriggers = this.view.querySelectorAll('.js-display-trigger');
    this.container = this.view.querySelector('.js-work-list');

    this.handleDisplay = this.handleDisplay.bind(this);
    this.initDisplay = this.initDisplay.bind(this);
  }

  handleClick = async () => {
  }

  bind() {
    this.on('click', this.handleClick);
  }

  handleDisplay(event) {
    if (!this.workDisplay.classList.contains('is-loaded')) {
      this.workDisplay.classList.add('is-loaded');
    }

    const sketch = getComponent('Sketch');
    const { index, text } = event.currentTarget.dataset;
    sketch.onSlide(Number(index));
    this.workText.innerHTML = text;
  }

  initDisplay() {
    this.workDisplay.classList.remove('is-loaded');
    setTimeout(() => {
      // gsap.set(this.workImage, { backgroundImage: '' });
      // const sketch = getComponent('Sketch');
      // sketch.leave();
      this.workText.innerHTML = '';
    }, 300);
  }

  init() {
    const { text } = this.displayTriggers[0].dataset;
    this.workDisplay.classList.remove('is-loaded');
    // gsap.set(this.workImage, { backgroundImage: `url("${background}")` });
    this.workText.innerHTML = text;
    this.workDisplay.classList.add('is-loaded');
  }

  events() {
    this.displayTriggers.forEach(trigger => {
      trigger.addEventListener('mouseover', this.handleDisplay);
    });

    this.container.addEventListener('mouseleave', this.initDisplay);
  }

  destroy() {
    this.displayTriggers.forEach(trigger => {
      trigger.removeEventListener('mouseover', this.handleDisplay);
    });

    this.container.removeEventListener('mouseleave', this.initDisplay);
    this.off('click', this.handleClick);
    super.destroy();
  }

  render() {
    this.bind();
    this.events();
    this.init();
  }
}
