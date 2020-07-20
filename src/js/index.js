import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import FastClick from 'fastclick'
import App from '@app/app/App'
import utils from '@app/utils/util-control'

import '../css/style.css'

gsap.registerPlugin(ScrollToPlugin);

(() => {
  const app = new App()
  app.init()
  FastClick.attach(document.body)

  if (process.env.NODE_ENV === 'development') {
    utils()
  }
})()
