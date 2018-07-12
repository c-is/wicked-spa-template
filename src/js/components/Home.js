import $ from 'jquery';
import { TweenMax } from 'gsap';

import Component from './Component';

export default class Home extends Component {
  constructor($view, options) {
    super($view);

    this.$view = $view;
    this.options = options;

    this.$listNav = $('.js-list-nav');

    this.scrollSecCount = 1;
    this.lastScrollTop = 0;
    this.countActive = false;

    this.render();
  }

  splitWord = () => (
    new Promise((resolve) => {
      $('.post__title').each((i, el) => {
        const tar = $(el).text();
        const str = tar.split('');
        const spanClass = 'splited';

        let markup = '';

        for (let n = 0; n < str.length; n += 1) {
          let spanCssClass = spanClass;
          if (str[n] === ' ') {
            spanCssClass = `${spanClass}--space`;
            str[n] = '';
          }
          markup += `<span class="${spanCssClass}">${str[n]}</span>`;
        }
        $(el).html(markup);

        if (i === $('.post__title').length - 1) {
          resolve();
        }
      });
    })
  )

  onScroll = () => {
    const st = $(window).scrollTop();
    const windowHeight = window.innerHeight;
    const headerHeight = $('.header').height();

    if (st > (windowHeight / 2) + headerHeight) {
      TweenMax.to('.bg', 1.2, { opacity: 0.2 });
      TweenMax.to('.top__shape', 1.2, { opacity: 0.1 });
    } else {
      TweenMax.to('.bg', 1.2, { opacity: 1 });
      TweenMax.to('.top__shape', 1.2, { opacity: 0.2 });
    }

    const turningPos = windowHeight * this.scrollSecCount;

    if (st > this.lastScrollTop) {
      if (st >= turningPos && st < turningPos * 1.125) {
        TweenMax.to(this.$listNav, 0.6, { opacity: 1 });
      } else if (st > turningPos * 1.125) {
        this.scrollSecCount += 1;
      } else {
        TweenMax.to(this.$listNav, 0.6, { opacity: 0 });
      }
    } else if (st < this.lastScrollTop) {
      if (st >= turningPos && st < turningPos * 1.125) {
        TweenMax.to(this.$listNav, 0.6, { opacity: 1 });
      } else if (st < turningPos / 1.125) {
        this.scrollSecCount -= 1;
      } else {
        TweenMax.to(this.$listNav, 0.6, { opacity: 0 });
      }
    }

    this.lastScrollTop = st;
  }

  postReveal = (e) => {
    const $parent = $(e.currentTarget).parents('.post');
    const $image = $parent.find('.post__image');

    $image.addClass('is-active');
  }

  postHide = (e) => {
    const $parent = $(e.currentTarget).parents('.post');
    const $image = $parent.find('.post__image');

    $image.removeClass('is-active');
  }

  events() {
    $(window).on('scroll', this.onScroll);
    this.$view.find('.post__link').on('mouseover', this.postReveal);
    this.$view.find('.post__link').on('mouseleave', this.postHide);
  }

  render() {
    this.splitWord();
    this.events();
    alert('home!!!');
  }
}

Component.Home = Home;
