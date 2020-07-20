export default class Overlay {
  overlay = null

  create() {
    this.overlay = document.createElement('div')
    this.overlay.className = 'overlay overlay--trans'
    document.body.appendChild(this.overlay)
  }

  destroy() {
    document.body.removeChild(this.overlay)
  }
}
