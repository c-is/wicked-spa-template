import Handler from '@app/app/Handler'
import { getStatus } from '@app/factories/registry'

export default class DefaultPage extends Handler {
  constructor() {
    super()
  }

  init() {
    const isAjaxActive = getStatus('isAjaxActive')

    if (isAjaxActive) {
      this.destroyBound = this.destroy.bind(this)
      window.addEventListener('popstate', this.destroyBound)
    }

    this.destroyBound = this.destroy.bind(this)
  }

  destroy() {
    super.destroy()
    window.removeEventListener('popstate', this.destroyBound)
  }

  initEvents() {
  }

  destroyEvents() {
  }

  render() {
    
  }

  preLoad() {
    
  }
}
