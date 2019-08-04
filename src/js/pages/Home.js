import $ from 'jquery';

import DefaultPage from './DefaultPage';

export default class Home extends DefaultPage {
  constructor($view, options) {
    super($view);

    this.$view = $view;
    this.options = options;
    this.$listNav = $('.js-list-nav');
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
    this.$view.find('.post__link').on('mouseover', this.postReveal);
    this.$view.find('.post__link').on('mouseleave', this.postHide);
  }

  render() {
    this.splitWord();
    this.events();
  }
}

// Component.Home = Home;
