import { html, escape, raw } from 'es6-string-html-template';
import Template from './Template';

export default class Article extends Template {
  constructor(template, data, options) {
    super(template, data, options);
    this.data = data[0];
    this.nextPost = data[1];
  }

  galleryRender = (gallery) => {
    let content = null;
    if (gallery) {
      content = html`
        ${gallery.map((image, i) => html`
          <div class="article__image article__image--${image.fields.description || ''}" data-id="${i + 1}">
            <div class="article__image-inner js-preload" data-animation="grow" data-timing="0.6" style="background-image: url(${image.fields.file.url})"></div>
          </div>
        `)}
      `;
    }

    return content;
  }

  urlRender = (url) => {
    let content = null;
    if (url) {
      content = html`
        <div class="article__note">
          <strong>URL</strong>
          <p><a href="${url}" target="_blank">${url}</a></p>
        </div>
      `;
    }
    return content;
  }

  nextPostRender = (post) => {
    let content = null;
    if (post) {
      content = html`
        <div class="next-post" data-animation="fadeUp">
          <p class="next-post__head">Next Post</p>
          <h4 class="next-post__title">${post.fields.title}</h4>
          <p class="next-post__subtitle">${post.fields.subTitle}<p>
          <a class="next-post__link js-ajax-trigger" href="/${post.fields.slug}" data-title="${post.fields.title}">${post.fields.title}</a>
        </div>
      `;
    }
    return content;
  }

  render() {
    const post = this.data.fields;
    return html`
      <div class="article">
        <a class="article__close js-ajax-trigger js-article-close" href="/" data-title="Home"><i class="arrow arrow--left"></i>Back</a>
        <div class="article__top">
          <div class="article__title-container">
            <h1 class="article__title">${post.title}</h1>
          </div>
          <div class="article__thumbnail">
            <img src="${post.thumbnail.fields.file.url}" alt="${post.title}">
          </div>
        </div>
        <div class="article__desc">
          <strong class="article__overview" data-animation="fadeUp">Project Overview</strong>
          <p data-animation="fadeUp">${raw(post.content)}</p>
        </div>
        <div class="article__notes" data-animation="fadeUp">
          ${this.urlRender(post.url)}
          <div class="article__note">
            <strong>SKILLSETS</strong>
            <p>${post.skillset}</p>
          </div>
        </div>
        <div class="article__gallery">
          ${this.galleryRender(post.gallery)}
        </div>
        ${this.nextPostRender(this.nextPost)}
      </div>
    `;
  }
}

