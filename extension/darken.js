const MAX_LIGHTNESS = 0.33

const darkenLoadedImage = (image) => {
  let width = image.naturalWidth
  let height = image.naturalHeight

  if (width == 0 || height == 0) {
    return
  }

  c.width = width
  c.height = height

  ctx.drawImage(image, 0, 0, width, height)
  const imageData = ctx.getImageData(0, 0, width, height)
  const newImageData = new ImageData(width, height)
  const data = imageData.data
  const newData = newImageData.data
  let lMax = 0
  for (let i = 0; i < data.length / 4; i++) {
    const r = data[i*4 + 0]
    const g = data[i*4 + 1]
    const b = data[i*4 + 2]
    const o = data[i*4 + 3]
    const t = new Color({r, g, b})
    lMax = Math.max(lMax, t.l)
  }
  const mult = MAX_LIGHTNESS / lMax
  for (let i = 0; i < newData.length / 4; i++) {
    const r = data[i*4 + 0]
    const g = data[i*4 + 1]
    const b = data[i*4 + 2]
    const o = data[i*4 + 3]
    newData[i*4 + 0] = r * mult
    newData[i*4 + 1] = g * mult
    newData[i*4 + 2] = b * mult
    newData[i*4 + 3] = o
  }
  ctx.putImageData(newImageData, 0, 0)


  try {
    return c.toDataURL()
  } catch(e) {
    console.log(e)
  }
  return
}

const darken = (image) => new Promise(
  (resolve, reject) => {
  const newImage = new Image()
  newImage.width = image.width
  newImage.height = image.height
  newImage.setAttribute('crossorigin', 'anonymous')

  newImage.onload = () => {
    const res = darkenLoadedImage(newImage)
    resolve(res)
  }
  newImage.onerror = reject
  newImage.src = image.src
})
