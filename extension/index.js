const c = document.createElement('canvas')
const ctx = c.getContext('2d', { willReadFrequently: true })

const SIZE = 15

const pixelate = (image) => {
  if (!image.complete) {
    return
  }
  const { width, height } = image.getBoundingClientRect()
  let w = SIZE
  let h = SIZE
  if (width > height) {
    h = Math.ceil(SIZE*height/width)
    if (width == 0) {
      return
    }
  } else {
    w = Math.ceil(SIZE*width/height)
    if (height == 0) {
      return
    }
  }
  if (w == 0 || h == 0) {
    return
  }
  c.width = w
  c.height = h

  ctx.drawImage(image, 0, 0, w, h)
  /* GRAYSCALE
  const imageData = ctx.getImageData(0, 0, w, h)
  const data = imageData.data
  for (let i = 0; i < data.length / 4; i++) {
    const r = data[i*4 + 0]
    const g = data[i*4 + 1]
    const b = data[i*4 + 2]
    const o = data[i*4 + 3]

    const sum = r + g + b
    data[i*4 + 0] = sum/3
    data[i*4 + 1] = sum/3
    data[i*4 + 2] = sum/3
  }
  ctx.putImageData(imageData, 0, 0)
  */

  image.setAttribute('crossorigin', 'anonymous')

  try {
    image.src = c.toDataURL()
    return true
  } catch(e) {
    console.log(e)
  }
  return
}

const addAttributes = () => {
  const images = document.querySelectorAll('img')
  for (const image of images) {
    res = pixelate(image)
    if (res || true) {
      image.setAttribute('data-substituted', true)
    }
  }
}



document.addEventListener('scroll', () => {
  addAttributes()
})
document.addEventListener('mousemove', () => {
  addAttributes()
})
document.addEventListener('click', () => {
  addAttributes()
})
addAttributes()
document.body.onload = addAttributes
