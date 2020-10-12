import $ from 'jquery';
import { gsap } from 'gsap';

import {
  Scroll,
  Animations,
  Loader,
  Overlay,
  Preload,
  Cursor,
} from '@app/widgets';

import * as Components from '@app/components';
import ClassFactory from '@app/factories/class-factory';

import {
  registerStatus,
  registerStatusAll,
  registerWidget,
  registerComponent,
  getStatusAll,
  getWidgetAll,
  getGlobal,
} from '@app/factories/registry';

import { setBrowserDetect } from '@app/utils/global';

import Trigger from './Trigger';
import getParams from './helper';

const { __DEV__ } = process.env;
const doc = getGlobal('doc');
const classFactory = new ClassFactory();


export default class Page {
  constructor() {
    this.$view = $('.main');
    [this.view] = this.$view;
    this.container = null;
    this.components = [];
    this.templates = [];
    this.page = null;
    this.isTransitionStart = false;

    this.trigger = new Trigger();
    this.loader = new Loader();
    this.scroll = new Scroll();
    this.animations = new Animations();
    this.overlay = new Overlay();
    this.preload = new Preload();
    this.cursor = new Cursor();

    this.resizeBound = this.resize.bind(this);
    this.backHandlerBound = this.backHandler.bind(this);
    this.pageTransitionBound = this.pageTransition.bind(this);

    this.register();
  }

  init() {
    const current = window.location.pathname;
    const pageConfig = {
      href: current,
      slug: current.replace(/\//g, ''),
    };

    setBrowserDetect();

    gsap.set(window, { scrollTo: 0 });
    this.events();

    this.preload.onPreload()
      .then(() => this.setPage(pageConfig))
      .then(() => this.turnOn())
      .then(() => this.loader.leave());

    this.trigger.setHistory();
  }

  events() {
    $(document).on('click', '.js-ajax-trigger', this.pageTransitionBound);
    $(window).on('popstate', this.backHandlerBound);
    $(window).on('resize', this.resizeBound);
  }

  register() {
    registerStatus('view', this.view);

    registerWidget('Loader', this.loader);
    registerWidget('Scroll', this.scroll);
    registerWidget('Animations', this.animations);
    registerWidget('Overlay', this.overlay);
    registerWidget('Preload', this.preload);
    registerWidget('Cursor', this.cursor);
  }

  backHandler(event) {
    if (window.history.length > 2 || document.referrer.length > 0) {
      this.pageTransition(event, true);
    }
  }

  scrollTo = position => (
    new Promise(resolve => {
      $('html, body').animate({ scrollTop: position }, 600, () => {
        resolve();
      });
    })
  )

  async getPage(params) {
    const nameSpace = this.view.dataset.namespace;
    const transition = this.pageTransitionBound;
    const props = { transition, params, nameSpace };

    classFactory.setPageClass(this.$view);

    this.page = await classFactory.getPageInstance(this.$view, nameSpace)
      .then(PageComponent => new PageComponent.default(this.$view, props));

    console.log(`${nameSpace} page rendered!`);
    this.page.render();
  }

  loadComponent($container = this.$view) {
    const $components = $container.find('[data-component]');

    for (let i = $components.length - 1; i >= 0; i -= 1) {
      const $component = $components.eq(i);
      const componentName = $component.data('component');

      if (Components[componentName] !== undefined) {
        const options = $component.data('options');
        const component = new Components[componentName]($component, options);

        registerComponent(componentName, component);
        this.components.push(component);
      } else {
        window.console.warn('There is no "%s" component!', componentName);
      }
    }
  }

  async setPage(props, update = false) {
    const {
      datasets,
      slug,
      // href,
      pagePosition = 0,
      isLoaded = true,
    } = props;

    let isAjaxActive = false;

    this.$view = $('.main');
    [this.view] = this.$view;
    this.setAnalytics(slug);

    if (update) {
      isAjaxActive = true;
      this.scroll = Scroll.update();
      this.register();
    }

    registerStatusAll({
      slug,
      isLoaded,
      isAjaxActive,
      pagePosition,
    });

    await this.getPage(datasets);
    this.loadComponent();

    // setCurrentLink(href)

    this.cursor.resetElements();
    await this.callLoaded();
    await this.scroll.render();
    this.scroll.onScrollParallax();
  }

  async pageTransition(event, back, custom = {}) {
    if (event) {
      event.preventDefault();
    }

    if (this.isTransitionStart) {
      return;
    }

    this.isTransitionStart = true;
    const currentPosition = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    const { slug, pagePosition } = getStatusAll();

    const params = getParams({
      event,
      back,
      custom,
      currentPosition,
      prevPosition: pagePosition,
      prevHref: window.history.state ? window.history.state.href : null,
    });

    const {
      nextSlug,
      nextHref,
      position,
      dataset,
    } = params;

    const isBack = back && !custom.href;
    const isSameUrl = slug === nextSlug && !isBack;

    const pageParams = {
      href: nextHref,
      pagePosition: position,
      datasets: dataset,
      slug: nextSlug,
    };

    const pageProps = {
      params: pageParams,
      back,
      position,
    };

    if (isSameUrl) {
      this.isTransitionStart = false;
      return;
    }

    this.overlay.create();
    await this.animations.leave(this.view);
    // this.loader.enter();

    if (!isBack) {
      this.trigger.setHistory(nextHref);
    }

    await this.trigger.load();
    await this.trigger.triggerClick(event);
    this.destroy();
    await this.renderNewPage(pageProps);

    this.isTransitionStart = false;
  }

  async renderNewPage({
    params,
    back,
    position,
    // skipAnim,
  }) {
    const container = this.trigger.render();
    registerStatus('view', container);

    await this.preload.onPreload();
    await this.setPage(params, true);

    // await this.loader.leave(true);
    this.overlay.destroy();
    gsap.set(window, { scrollTo: 0 });

    await this.animations.enter(container);
    await this.callLoaded();

    this.isTransitionStart = false;
    this.scroll.scrollInit();

    if (back) {
      await this.scrollTo(position);
    }

    return Promise.resolve();
  }

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
    this.callAll('turnOff')
  }

  async turnOn() {
    return this.callAll('turnOn')
  }

  async callLoaded(...args) {
    if (typeof this.page.loaded === 'function') {
      this.page.loaded(...[].slice.call(args, 1))
    }

    return this.callAll('loaded')
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

  async callAll(fn, ...args) {
    /* eslint no-restricted-syntax: ['error', 'WithStatement', 'BinaryExpression[operator="in"]'] */
    for (const component of this.components) {
      if (typeof component[fn] === 'function') {
        if (component[fn].constructor.name === 'AsyncFunction') {
          await component[fn](...[].slice.call(args, 1));
        } else {
          component[fn](...[].slice.call(args, 1));
        }
      }
    }

    console.log(fn)

    if (!this.page) {
      return;
    }

    if (typeof this.page[fn] === 'function') {
      this.page[fn](...[].slice.call(args, 1));
    }
  }

  destroy() {
    this.callAll('destroy');
    this.scroll.destroy();
    this.animations.destroy();
    this.components = [];
    this.templates = [];

    gsap.killTweensOf(this.view);

    this.$view.off();
    this.$view = null;
  }

  setAnalytics = pathname => {
    if (window.ga && !__DEV__) window.ga('send', 'pageview', pathname);
  }
}
