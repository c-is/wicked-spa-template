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
  let typeProp = ''
  let nextHref = prevHref

  if (event) {
    datasets = event.currentTarget.dataset
    if (datasets) { typeProp = datasets.type }

    if (!back) {
      nextHref = event.currentTarget.getAttribute('href')
    }
  }

  if (back) {
    position = prevPosition
    nextHref = prevHref
  }

  if (custom.href) { nextHref = custom.href }
  if (custom.type) { typeProp = custom.type }
  const nextSlug = nextHref.replace(/\//g, '')

  return {
    nextSlug,
    nextHref,
    position,
    type: typeProp,
    dataset: datasets,
  }
}

export default getParams
