import $ from 'jquery';
import imagesLoaded from 'imagesloaded';

import Handler from '../app/Handler';
import { isAjaxActive } from '../app/globals';

export default class DefaultPage extends Handler {
  constructor() {
    super();
  }

  init() {
    if (isAjaxActive) {
      this.destroyBound = this.destroy.bind(this);
      window.addEventListener('popstate', this.destroyBound);
    }
    this.destroyBound = this.destroy.bind(this);
    // this.preLoad();
  }

  destroy() {
    super.destroy();
    window.removeEventListener('popstate', this.destroyBound);
  }

  initEvents() {
  }

  destroyEvents() {
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
          // this.loaderOut(progress).then(() => { this.loaderSet() });
        }).on('always', () => {
          $('body').removeClass('load-start').addClass('load-completed');
          resolve(true);
        });
      } else {
        $('body').removeClass('load-start').addClass('load-completed');
        resolve();
        // this.loaderOut(90).then(() => {
        //   this.loaderSet();
        //   $('body').removeClass('load-start').addClass('load-completed');
        // });
      }
    });
  }
}
