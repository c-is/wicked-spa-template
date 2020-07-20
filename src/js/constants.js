export const TRANSITION_EASE = 'power3.out'
export const TRANSITION_TIMING = 1.2

export const backgroundColours = {
  home: ['#272727', '#2727ff'],
  visual: ['#272727', '#2727ff'],
  industrial: ['#272727', '#2727ff'],
  single: ['#ffffff'],
  contact: ['#ffffff', '#272727'],
}

export const getColours = slug => (
  backgroundColours[slug]
    ? backgroundColours[slug] : ['#ffffff']
)
