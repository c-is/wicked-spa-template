import $ from 'jquery';
import axios from 'axios';
import metapatcher from 'metapatcher';
import Handler from './Handler';
import History from '../history';

metapatcher.configure({
  facebookTags: { enabled: true },
  openGraphTags: { enabled: true },
  twitterTags: { enabled: true },
});


export default class Trigger extends Handler {
  static back(url) {
    if (window.history.length > 2 || document.referrer.length > 0) {
      History.back();
    } else if (url) {
      History.replace(null, null, url);
    } else {
      History.replace(null, null, '/');
    }
  }

  constructor() {
    super();
    this.request = null;
    this.timeout = null;
    this.loadedData = null;
    this.CancelToken = null;
    this.source = null;

    this.metapatcher = metapatcher;
    this.render = this.render.bind(this);
  }

  setHistory = href => {
    const baseURL = href
      ? href.replace(`http://${window.location.host}`, '')
      : window.location.pathname;

    const page = document.querySelector('[data-page]');
    const title = page.dataset.page;
    const prev = window.history.state || '';
    const slug = baseURL.replace(/\//g, '');

    const stateObj = {
      title,
      prev,
      slug,
      href: baseURL,
      randomData: Math.random(),
    };

    window.history.pushState(stateObj, '', baseURL);
  }

  triggerClick = event => {
    if (event) event.preventDefault();
    return this.trigger('click', event);
  }

  clearToken() {
    this.CancelToken = null;
    this.source = null;
  }

  load() {
    // cancel old request:
    if (this.CancelToken) this.source.cancel('cancelled');

    const path = window.location.pathname;
    const search = window.location.search || '';
    const url = path + search;

    this.CancelToken = axios.CancelToken;
    this.source = this.CancelToken.source();

    return axios.get(url, {
      cancelToken: this.source.token,
    })
      .then(({ data }) => {
        this.loadedData = data;
        this.clearToken();
      })
      .catch(() => {
        this.clearToken();
      });
  }

  render() {
    const data = this.loadedData;
    const container = document.querySelector('.wrapper');
    const ldJson = document.querySelector('[type="application/ld+json"]');
    const $wrapper = $(data).filter('.wrapper');
    const $loadedContent = $('.wrapper', data)[0] ? $('.wrapper', data) : $wrapper;

    if (ldJson) {
      const newLdjson = $(data).filter('[type="application/ld+json"]')[0];

      if (newLdjson) {
        ldJson.text = newLdjson.text;
      }
    }

    if ($wrapper) {
      const meta = $wrapper.data('meta');
      this.metapatcher.setPageMeta({ ...meta });
    }

    const code = $loadedContent.html();
    container.style.opacity = 0;
    $(container).html(code);
    this.loadedData = null;

    return container;
  }
}
