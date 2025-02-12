const nude = (image) => {
  let width = image.naturalWidth
  let height = image.naturalHeight

  if (width == 0 || height == 0) {
    return false
  }

  c.width = width
  c.height = height
  const countTotal = width * height

  if (countTotal <= 100 * 100) {
    return false
  }

  ctx.drawImage(image, 0, 0, width, height)
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  let count = 0
  for (let i = 0; i < data.length / 4; i++) {
    const r = data[i*4 + 0]
    const g = data[i*4 + 1]
    const b = data[i*4 + 2]
    const o = data[i*4 + 3]
    const t = new Color({r, g, b})
    if (r > 95 && g > 40 && b > 20 && r > g && r > b &&
      Math.abs(r - g) > 15 && t.h >= 0 && t.h <= 50 &&
      t.s >= 0.23 && t.s <= 0.78
      ) {
      count++
    }
  }
  return count > countTotal * 0.38
}
