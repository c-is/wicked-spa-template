import $ from 'jquery';

import DefaultPage from './../pages/_default-page';
import HomePage from './../pages/home-page';
import AboutPage from './../pages/about-page';
import ErrorPage from './../pages/error-page';

export default class ClassFactory {
  getPageInstance(page, pageType) {
    // console.log('– Pages')

    switch(pageType) {
      case 'homepage':
        return new HomePage(page, pageType)
      case 'about':
        return new AboutPage(page, pageType)
      case 'error-page':
        return new ErrorPage(page, pageType)
      default:
        return new DefaultPage(page, pageType)
    }
  }

  setPageClass(page) {
    const pageName = page.data('page');
    $('body').removeClass((index, className) => (className.match(/(^|\s)is-\S+/g) || []).join(' '));
    $('body').addClass(`is-${pageName.toLowerCase()}`);
  }
}

