import imagesLoaded from 'imagesloaded'

import { getWidget, getStatus } from '@app/factories/registry'


export default class Preload {
  loadingImages = null

  onLoadVideo = () => (
    new Promise(resolve => {
      const video = document.querySelector('.js-video')

      if (!video) {
        return resolve()
      }

      return video.addEventListener('canplaythrough', () => {
        resolve()
      }, false)
    })
  )

  onLoadImage() {
    return new Promise(resolve => {
      const loader = getWidget('Loader')

      this.loadingImages.on('progress', instance => {
        const amount = instance.progressedCount / instance.images.length
        const progress = Math.round(amount * 100)
        loader.onProgress(progress)
      }).on('always', async () => {
        await this.onLoadVideo()
        resolve()
      })
    })
  }

  onPreload() {
    const view = getStatus('view')
    const preloads = view.querySelectorAll('.js-preload')


    const loadingImages = imagesLoaded(
      // this.$view.find('.js-preload').toArray(),
      preloads,
      { background: true },
    )

    const images = []

    if (this.page) {
      images.concat(this.page.preloadImages())
    }

    // for (const page of this.pages) {
    //   images = images.concat(page.preloadImages())
    // }

    for (const url of images) {
      loadingImages.addBackground(url, null)
    }

    this.loadingImages = loadingImages

    return this.loadingImages.images.length > 0
      ? this.onLoadImage()
      : Promise.resolve()
  }
}
