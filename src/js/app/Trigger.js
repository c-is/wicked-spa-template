import $ from 'jquery';
import { TweenMax } from 'gsap';
import 'gsap/ScrollToPlugin';
import createHistory from 'history/createBrowserHistory';

const History = createHistory();

const TIMING_IN = 1;
const TIMING_OUT = 0.4;


export default class Trigger {
  static TIME_LIMIT = 5000;
  static CONTENT_SELECTOR = '#container';
  static HEADER = '.header';
  static FOOTER = '.footer';

  static back(url) {
    if (history.length > 2 || document.referrer.length > 0) {
      History.back();
    } else if (url) {
      History.replace(null, null, url);
    } else {
      History.replace(null, null, '/');
    }
  }

  static pagePosition(position) {
    this.position = position || this.position;

    return this.position;
  }

  static setHistory = (e) => {
    const baseURL = (e) ? $(e.currentTarget).attr('href').replace(`http://${window.location.host}`, '') : window.location.pathname;
    const oldTitle = (history.state) ? history.state.title : '';
    const pageTitle = (e) ? $(e.currentTarget).attr('data-title') : $(['data-page-title']).data('data-page-title');
    const path = baseURL.replace(/\//g, '');
    const stateObj = {
      randomData: Math.random(),
      title: pageTitle,
      prevTitle: oldTitle,
      slag: path,
    };

    window.history.pushState(stateObj, '', baseURL);
  };

  static setTitle = (event) => {
    const title = $(event.currentTarget).data('title') || $(['data-page-title']).data('data-page-title');
    document.title = `${title} | C is`;
  }

  constructor() {
    this.request = null;
    this.timeout = null;
  }

  animateOut = () => {
    const scrollPos = $(window).scrollTop();
    const contentHeight = $(Trigger.CONTENT_SELECTOR).offset().top;
    const dir = (scrollPos > (contentHeight / 2)) ? 100 : -100;

    return new Promise((resolve) => {
      TweenMax.to(Trigger.HEADER, TIMING_OUT, { y: '-100%' });
      TweenMax.to(Trigger.FOOTER, TIMING_OUT, { y: '100%', opacity: 0 });

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

  load() {
    // cancel old request:
    if (this.request) this.request.abort();

    // define url
    const path = window.location.pathname;
    const search = window.location.search || '';
    const url = path + search;

    // define timeout
    window.clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (this.request) window.location.reload();
    }, Trigger.TIME_LIMIT);

    // return promise
    // and do the request:
    return new Promise((resolve, reject) => {
      // do the usual xhr stuff:
      this.request = new XMLHttpRequest();
      this.request.open('GET', url);
      this.request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

      // onload handler:
      this.request.onload = () => {
        if (this.request.status === 200) {
          this.loadedData = this.request.responseText;
          // this.trigger(PushStatesEvents.PROGRESS, 1);
          resolve(true);
        } else {
          reject(Error(this.request.statusText));

          if (this.request.statusText !== 'abort') {
            window.location.reload();
          }
        }

        this.request = null;
        window.clearTimeout(this.timeout);
      };

      // catching errors:
      this.request.onerror = () => {
        console.log('error');
        reject(Error('Network Error'));
        window.clearTimeout(this.timeout);
        this.request = null;
      };

      // catch progress
      this.request.onprogress = (e) => {
        if (e.lengthComputable) {
          // this.trigger(PushStatesEvents.PROGRESS, e.loaded / e.total);
        }
      };

      // send request:
      this.request.send();
    });
  }

  render() {
    const data = this.loadedData;
    const container = Trigger.CONTENT_SELECTOR;
    const $loadedContent = $(container, data)[0] ? $(container, data) : $(data).filter(container);
    const code = $loadedContent.html();

    $(container).html(code);
  }
}
