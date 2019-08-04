import $ from 'jquery';
import { TweenMax } from 'gsap';
import Hammer from 'hammerjs';
import { browserDetect } from '../app/Globals';

export default class ImageModal {
  constructor(props) {
    this.view = props.view;

    this.el = '';
    this.nav = '';
    this.hammer = '';
    this.imageId = 0;
    this.images = [];
    this.activated = false;

    this.events();
  }

  events() {
    $(this.view).on('click', '.js-image-modal', this.enlargeImage);
  }

  imageCollection(val) {
    this.images.push(val);
  }

  discardEvents() {
    this.el.removeEventListener('click', this.closeImage);
    this.view.removeEventListener('click', this.enlargeImage);
    this.hammer = null;
  }

  hammerInit = (view) => {
    this.hammer = new Hammer.Manager(view);

    const swipe = new Hammer.Swipe();

    this.hammer.add(swipe);
    this.hammer.on('swipeleft', this.swipeEvents);
    this.hammer.on('swiperight', this.swipeEvents);
  };

  swipeEvents = (e) => {
    const number = (e.type === 'swipeleft') ? 1 : -1;
    const data = this.images[this.imageId + number] || '';

    if (data) {
      this.imageId = this.imageId + number;
      this.setImage(data);
    }
  };

  setImage = (data) => {
    TweenMax.to('.enlarge-image img', 0.6, {
      alpha: 0,
      onComplete: () => {
        const $image = $(`<img src="${data}" />`);
        const image = this.el.querySelector('img');

        $image.on('load', () => {
          image.setAttribute('src', data);
          TweenMax.to('.enlarge-image img', 0.4, {
            alpha: 1,
            delay: 0.2,
          });
        });
      },
    });
  };

  closeImage = () => {
    $('body').removeClass('is-modal');
    TweenMax.to(this.el, 0.4, {
      autoAlpha: 0,
      onComplete: () => {
        this.discardEvents();
        this.view.removeChild(this.el);
      },
    });
  };

  show = () => (
    new Promise((resolve) => {
      TweenMax.to(this.el, 0.4, {
        autoAlpha: 1,
        onComplete: () => {
          resolve();
        },
      });
    })
  );

  showNav = () => {
    if (browserDetect().mobile && !this.activated) {
      TweenMax.to(this.nav, 0.5, {
        autoAlpha: 1,
        delay: 0.2,
        onComplete: () => {
          TweenMax.to(this.nav, 0.6, {
            autoAlpha: 0,
            delay: 0.3,
          });
        },
      });

      this.activated = true;
    }
  };

  enlargeImage = (event) => {
    event.preventDefault();

    $('body').addClass('is-modal');

    this.imageId = event.currentTarget.getAttribute('data-id') - 1;

    const src = event.currentTarget.getAttribute('data-src');
    const img = document.createElement('img');

    img.setAttribute('src', src);

    this.el = document.createElement('div');
    this.el.className = 'enlarge-image';
    this.el.appendChild(img);

    if (!this.activated) {
      this.nav = document.createElement('span');
      this.nav.className = 'enlarge-image__nav';
      this.el.appendChild(this.nav);
    }

    this.view.appendChild(this.el);
    this.hammerInit(this.el);

    this.show().then(() => {
      this.showNav();
    });

    this.el.addEventListener('click', this.closeImage);
  }
}
