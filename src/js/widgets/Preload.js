import imagesLoaded from 'imagesloaded'
import axios from 'axios'

import { getWidget, getStatus } from '@app/factories/registry'


export default class Preload {
  loadingImages = null

  onLoadVideo = video => (
    new Promise(resolve => {
      if (!video) {
        return resolve()
      }

      const { src } = video.dataset

      return axios.get(src)
        .then(res => {
          console.log(res)
          if (res.status === 200) {
            // const blob = res.data
            // const source = URL.createObjectURL(blob);
            video.src = src
            // video.play()
            resolve(video)
          }
        })
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
        resolve()
      })
    })
  }

  async onPreload() {
    const view = getStatus('view')
    const preloads = view.querySelectorAll('.js-preload')
    const videos = view.querySelectorAll('.js-preload-video')


    const loadingImages = imagesLoaded(
      // this.$view.find('.js-preload').toArray(),
      preloads,
      { background: true },
    )

    const images = []

    if (this.page) {
      images.concat(this.page.preloadImages())
    }


    if (videos.length > 0) {
      const videoResults = []

      for (const video of videos) {
        videoResults.push(this.onLoadVideo(video))
      }

      const response = await Promise.all(videoResults)
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
