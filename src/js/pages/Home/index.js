import { gsap } from 'gsap'
import { TRANSITION_EASE, TRANSITION_TIMING } from '@app/constants'
import { browserDetect } from '@app/utils/global'
import DefaultPage from '../DefaultPage'
// const TIMING_SECTION = 0.6
const isMobile = browserDetect().mobile


export default class Home extends DefaultPage {
  constructor($view, props) {
    super($view)

    this.$view = $view
    this.props = props
  }

  handleClick = async (event) => {
  }

  bind() {
    this.on('click', this.handleClick)
  }

  // events() {
  // }

  destroy() {
    this.off('click', this.handleClick)
    super.destroy()
  }

  render() {
    this.bind()
    // this.events()
  }
}
