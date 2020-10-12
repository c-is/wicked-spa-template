import { invertColor } from './utils'

export default function utilControl() {
  const doc = document.documentElement
  const gridControl = document.getElementById('util-grid-controller')
  const themeControl = document.getElementById('util-theme-controller')
  const grids = document.querySelector('.util-grids')

  gridControl.addEventListener('change', ({ currentTarget }) => {
    const { checked } = currentTarget
    if (checked) {
      grids.classList.add('is-active')
    } else {
      grids.classList.remove('is-active')
    }
  })

  themeControl.addEventListener('change', ({ currentTarget }) => {
    const { checked } = currentTarget
    if (checked) {
      // dark mode
      const differenceColour = invertColor('#9FB500')
      doc.style.setProperty('--colour-font', '#fff')
      doc.style.setProperty('--colour-font-contrast', '#272727')
      doc.style.setProperty('--colour-bg', '#272727')
      doc.style.setProperty('--colour-primary', '#9FB500')
      doc.style.setProperty('--colour-primary-difference', differenceColour)
      doc.style.setProperty('--colour-bg-secondary', '#ccc')
      doc.style.setProperty('--colour-cursor', '#D9000D')
    } else {
      const differenceColour = invertColor('#33f')
      doc.style.setProperty('--colour-font', '#272727')
      doc.style.setProperty('--colour-font-contrast', '#fff')
      doc.style.setProperty('--colour-bg', '#fff')
      doc.style.setProperty('--colour-primary', '#33f')
      doc.style.setProperty('--colour-primary-difference', differenceColour)
      doc.style.setProperty('--colour-bg-secondary', '#272727')
      doc.style.setProperty('--colour-cursor', '#D9000D')
    }
  })
}
