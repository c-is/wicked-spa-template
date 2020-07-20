export default class ClassFactory {
  getPageInstance = (page, pageType) => {
    switch (pageType) {
      case 'home':
        return import(/* webpackChunkName: 'home' */ '../pages/Home')
      // case 'error-page':
      //   return new ErrorPage(page, pageType)
      default:
        return import(/* webpackChunkName: 'default' */ '../pages/DefaultPage.js')
    }
  }

  setPageClass = page => {
    const pageName = page.data('namespace')
    const className = page.data('class')
    const { body } = document
    const list = [...body.classList]

    list.forEach(name => {
      if (name.match(/(^|\s)is-\S+/g)) {
        body.classList.remove(name)
      }
    })

    body.classList.add(`is-${pageName.toLowerCase()}`)

    if (className) {
      body.classList.add(`is-${className.toLowerCase()}`)
    }
  }
}
