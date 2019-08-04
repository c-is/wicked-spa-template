import $ from 'jquery';
import imagesLoaded from 'imagesloaded';
import { TweenMax } from 'gsap';

import Trigger from './Trigger';
import Scroll from './Scroll';
import Animations from './Animations';
import Loader from './Loader';

import * as Components from '../components';
import * as Templates from '../templates';
import model from './Models';
import ClassFactory from './factories/class-factory';

const classFactory = new ClassFactory();

const TIMING_IN = 1;
// const TIMING_OUT = 0.4;


export default class Page {
  constructor() {
    this.$view = $('.main');
    this.components = [];
    this.templates = [];
    this.model = model;
  }

  init() {
    this.globalEvents();
    this.loadTemplate().then(() => {
      this.loadComponent();
      this.getPage();
      this.preLoad();
      this.trigger = new Trigger();
      this.scroll = new Scroll();
      Trigger.setHistory();
    });
  }

  globalEvents() {
    $(document).on('click', '.js-ajax-trigger', this.pageTransition);

    $(window).on('popstate', (event) => {
      if (history.length > 2 || document.referrer.length > 0) {
        this.pageTransition(event, true);
      }
    });
  }

  getPage() {
    // if (jsWrapper === null) jsWrapper = document.getElementsByClassName('js-ajax-container')[0]
    const nameSpace = this.$view.data('namespace');
    classFactory.getPageInstance(this.$view, nameSpace);
    classFactory.setPageClass(this.$view);
  }

  getTemplate(obj) {
    const { load, name, $el, options } = obj;

    return new Promise((resolve) => {
      this.model.loadPost(name, load).then((data) => {
        this.template = new Templates[name]($el, data, options);
        const renderData = this.template.render();
        this.templates.push(this.template);
        resolve(renderData.v);
      });
    });
  }

  async loadTemplate() {
    const templates = this.$view.find('[data-template]');
    const $templates = templates.length > 0 ? templates : [];

    const templateExe = (i) => {
      const $template = $templates.eq(i);
      const name = $template.data('template');

      if (Templates[name] !== undefined) {
        const options = $template.data('options');
        const load = $template.data('load') || '';

        this.getTemplate({
          $el: $template, name, options, load,
        }).then((data) => {
          $template.html(data);
          TweenMax.to($template, TIMING_IN, { opacity: 1 });
        });
      } else {
        window.console.warn('There is no "%s" template!', name);
      }
    };

    return new Promise((resolve) => {
      $templates.forEach(async (template, i) => {
        await templateExe(i);
      });

      resolve();
    });
  }

  loadComponent() {
    const $components = this.$view.parent().find('[data-component]');

    for (let i = $components.length - 1; i >= 0; i -= 1) {
      const $component = $components.eq(i);
      const componentName = $component.data('component');

      if (Components[componentName] !== undefined) {
        const options = $component.data('options');
        const component = new Components[componentName]($component, options);

        this.components.push(component);
      } else {
        window.console.warn('There is no "%s" component!', componentName);
      }
    }
  }

  updatePage = ({ tempSlug }) => {
    this.$view = $('.main');
    this.setAnalytics(tempSlug);
  };

  pageTransition = (event, back) => {
    event.preventDefault();

    let tempSlug = !back ? event.currentTarget.getAttribute('href') : history.state.slug;
    tempSlug = tempSlug.replace(/\//g, '');

    Animations.animateOut()
      .then(() => (
        Loader.loaderIn()
      ))
      .then(() => {
        this.destroy();
        if (!back) Trigger.setHistory(event, back);
        return this.trigger.load();
      })
      .then(() => {
        this.trigger.render();
        return this.loadTemplate();
      })
      .then(() => {
        this.updatePage({ tempSlug });
        return this.preLoad();
      })
      .then(() => {
        this.getPage();
        this.loadComponent();
        Animations.animateIn();
        Scroll.updateScroll();
      })
      .catch((error) => {
        console.log(error);
        console.log('Error!');
      });
  };

  onState() {
    let changed = false;

    for (const component of this.components) {
      const componentChanged = component.onState();
      if (!changed && !!componentChanged) {
        changed = true;
      }
    }

    return changed;
  }

  turnOff() {
    this.callAll('turnOff');
  }

  turnOn() {
    this.callAll('turnOn');
  }

  destroy() {
    this.callAll('destroy');
    this.components = [];
    this.templates = [];
    Scroll.destroyScroll();

    TweenMax.killTweensOf(this.view);

    this.$view.off();
    this.$view = null;
    this.pageTitle = null;
  }

  callAll(fn, ...args) {
    for (const component of this.components) {
      if (typeof component[fn] === 'function') {
        component[fn].apply(component, [].slice.call(arguments, 1));
      }
    }
    for (const template of this.templates) {
      if (typeof template[fn] === 'function') {
        template[fn].apply(template, [].slice.call(arguments, 1));
      }
    }
  }

  preLoad() {
    const loadingImages = imagesLoaded(this.$view.find('.js-preload').toArray(), { background: true });
    let images = [];

    for (const component of this.components) {
      images = images.concat(component.preloadImages());
    }

    for (const url of images) {
      loadingImages.addBackground(url, null);
    }

    return new Promise((resolve) => {
      $('body').addClass('load-start');
      this.loader = loadingImages;

      if (this.loader.images.length > 0) {
        this.loader.on('progress', (instance) => {
          const progress = (instance.progressedCount / instance.images.length) * 100;
          Loader.loaderOut(progress).then(() => { Loader.loaderSet() });
        }).on('always', () => {
          $('body').removeClass('load-start').addClass('load-completed');
          resolve(true);
        });
      } else {
        Loader.loaderOut(90).then(() => {
          Loader.loaderSet();
          $('body').removeClass('load-start').addClass('load-completed');
        });
      }
    });
  }

  setAnalytics(pathname) {
    if (window.ga) window.ga('send', 'pageview', pathname);
  }
}
