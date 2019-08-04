import { html, escape, raw } from 'es6-string-html-template';
import Template from './Template';

export default class Home extends Template {
  constructor(template, data, options) {
    super(template, data, options);
    this.data = data;
  }

  render() {
    return html`
      ${ this.data.map(post => html`
        <div class="post" data-animation="post">
          <div class="post__inner">
            <div class="post__text">
              <div class="post__circle"></div>
              <h2 class="post__title">${post.fields.title}</h2>
              <p class="post__subtitle">${post.fields.subTitle}</p>
              <div class="post__desc">
                <p>${raw(post.fields.content.substring(0, 80))}...</p>
                <a href="/${post.fields.slug}" class="post__link js-ajax-trigger" data-title="${post.fields.title}"><span>Read more</span></a>
              </div>
            </div>
            <div class="post__image">
              <img class="js-preload" src="${post.fields.thumbnail.fields.file.url}" alt="Worlder">
            </div>
          </div>
        </div>
      `)}
    `;
  }
}
