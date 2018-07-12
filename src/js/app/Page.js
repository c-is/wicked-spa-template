import $ from 'jquery';
import imagesLoaded from 'imagesloaded';
import { TweenMax, Sine } from 'gsap';
import Trigger from './Trigger';
import Scroll from './Scroll';
import * as Components from '../components';
import * as Templates from '../templates';
import Model from './Models';


const DEFAULT_URL = window.location.pathname.replace(/\//g, '');
const TIMING_IN = 1;
const TIMING_OUT = 0.4;


export default class Page {
  constructor() {
    this.$view = $('.main');

    this.components = [];
    this.templates = [];
    this.model = new Model();

    this.globalEvents();

    this.loadTemplate({ slug: DEFAULT_URL }).then(() => {
      this.loadComponent();
      this.loadPage();
      this.preLoad();
      this.trigger = new Trigger();
      this.scroll = new Scroll();
      Trigger.setHistory();
    });
  }

  globalEvents() {
    $(document).on('click', '.js-ajax-trigger', this.pageTransition);

    $(window).on('popstate', (e) => {
      if (history.length > 2 || document.referrer.length > 0) {
        this.pageTransition(e, true);
      }
    });
  }

  getTemplate(obj) {
    const { slug, load, name, $el, options } = obj;

    return new Promise((resolve) => {
      Model.loadPost(slug, load).then((data) => {
        this.template = new Templates[name]($el, data, options);
        const renderData = this.template.render();

        this.templates.push(this.template);
        resolve(renderData.v);
      });
    });
  }

  async loadTemplate(props) {
    const { slug } = props;
    const $templates = this.$view.find('[data-template]').length > 0 ? this.$view.find('[data-template]') : [];

    const templateExe = (i) => {
      const $template = $templates.eq(i);
      const name = $template.data('template');

      if (Templates[name] !== undefined) {
        const options = $template.data('options');
        const load = $template.data('load') || '';

        this.getTemplate({
          $el: $template, name, options, slug, load,
        }).then((data) => {
          $template.html(data);
          TweenMax.to($template, TIMING_IN, { opacity: 1 });
        });
      } else {
        window.console.warn('There is no "%s" template!', name);
      }
    };

    console.log($templates);

    return new Promise((resolve) => {
      $templates.forEach(async (template, i) => {
        await templateExe(i);
      });

      resolve();
    });
  }

  loadPage() {
    const pageName = this.$view.data('page');

    $('body').removeClass((index, className) => (className.match(/(^|\s)is-\S+/g) || []).join(' '));
    $('body').addClass(`is-${pageName.toLowerCase()}`);
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
  }

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

  setPostPosition = ({ currentTarget }) => {
    if (currentTarget && $(currentTarget).hasClass('post__link')) {
      const $parent = $(currentTarget).parents('.post');
      const position = $parent.offset().top;
      Trigger.pagePosition(position);
    }
  };

  getPostPosition = ({ currentTarget }) => {
    if (currentTarget && $(currentTarget).hasClass('js-article-close')) {
      const position = Trigger.pagePosition();
      TweenMax.set(window, { scrollTo: position });
      Trigger.pagePosition(0);
    }
  };

  pageTransition = (e, back) => {
    e.preventDefault();

    const event = !back ? e : '';

    let tempSlug = !back ? e.currentTarget.getAttribute('href') : history.state.slug;
    tempSlug = tempSlug.replace(/\//g, '');

    this.setPostPosition(event);

    this.trigger.animateOut()
      .then(() => (
        this.loaderIn()
      ))
      .then(() => {
        this.destroy();
        if (!back) Trigger.setHistory(event);
        return this.trigger.load();
      })
      .then(() => {
        this.trigger.render();
        this.$view = $('.main');
        Trigger.setTitle(event);
        this.setAnalytics(tempSlug);
        return this.loadTemplate({ slug: tempSlug });
      })
      .then(() => {
        this.loadComponent();
        this.loadPage();
        Scroll.updateScroll();
        this.getPostPosition(event);
        this.trigger.animateIn();
        this.preLoad();
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

          this.loaderOut(progress).then(() => {
            this.loaderSet();
          });
        }).on('always', () => {
          $('body').removeClass('load-start').addClass('load-completed');

          resolve(true);
        });
      } else {
        this.loaderOut(90).then(() => {
          this.loaderSet();

          $('body').removeClass('load-start').addClass('load-completed');
        });
      }
    });
  }

  setAnalytics(pathname) {
    if (window.ga) {
      window.ga('send', 'pageview', pathname);
    }
  }
}
