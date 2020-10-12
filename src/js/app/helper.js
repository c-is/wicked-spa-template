const getParams = data => {
  const {
    event,
    back,
    currentPosition,
    prevPosition,
    prevHref,
    custom,
  } = data

  let position = currentPosition
  let datasets = {}
  let nextHref = prevHref

  if (event) {
    datasets = event.currentTarget.dataset

    if (!back) {
      nextHref = event.currentTarget.getAttribute('href')
    }
  }

  if (back) {
    position = prevPosition
    nextHref = prevHref
  }

  if (custom.href) { nextHref = custom.href }
  const nextSlug = nextHref.replace(/\//g, '')

  return {
    nextSlug,
    nextHref,
    position,
    dataset: datasets,
  }
}

export default getParams
