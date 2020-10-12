import $ from 'jquery'
import { gsap } from 'gsap'
import { browserDetect } from '@app/utils/global'
import { getWidget } from '@app/factories/registry'
import Component from '../Component'

const isMobile = browserDetect().mobile

export default class Tabs extends Component {
  constructor($view) {
    super($view)

    this.$view = $view;
    [this.view] = $view

    this.init()
  }

  init = () => {
    $('.tabs nav a').on('click', e => {
      e.preventDefault()
      const tabId = e.target.getAttribute('href')

      $('.tabs nav a').removeClass('current')
      $('.c-tabs-tab').removeClass('current')

      e.target.classList.add('current')
      $(tabId).addClass('current')
    })
  }
}
