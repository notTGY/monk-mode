const SIZE = 15

const pixelify = (image) => {
  let width = image.naturalWidth
  let height = image.naturalHeight

  if (width == 0 || height == 0) {
    return
  }
  let w = SIZE
  let h = SIZE
  if (width > height) {
    h = Math.ceil(SIZE*height/width)
  } else {
    w = Math.ceil(SIZE*width/height)
  }
  const smallerData = []
  for (let row = 0; row < h; row++) {
    smallerData[row] = []
    for (let col = 0; col < w; col++) {
      smallerData[row][col] = [0, 0, 0, 0, 0]
    }
  }

  c.width = width
  c.height = height

  ctx.drawImage(image, 0, 0, width, height)
  const imageData = ctx.getImageData(0, 0, width, height)
  const newImageData = new ImageData(width, height)
  const data = imageData.data
  const newData = newImageData.data
  for (let i = 0; i < data.length / 4; i++) {
    const r = data[i*4 + 0]
    const g = data[i*4 + 1]
    const b = data[i*4 + 2]
    const o = data[i*4 + 3]

    const x = i % width
    const y = Math.floor((i-x) / width)

    const col = Math.floor(w * x / width)
    const row = Math.floor(h * y / height)

    smallerData[row][col][0] += r
    smallerData[row][col][1] += g
    smallerData[row][col][2] += b
    smallerData[row][col][3] += o
    smallerData[row][col][4] += 1
  }
  for (let i = 0; i < newData.length / 4; i++) {
    const x = i % width
    const y = Math.floor((i-x) / width)

    const col = Math.floor(w * x / width)
    const row = Math.floor(h * y / height)

    let [r, g, b, o, count] = smallerData[row][col]

    newData[i*4 + 0] = r / count
    newData[i*4 + 1] = g / count
    newData[i*4 + 2] = b / count
    newData[i*4 + 3] = o / count
  }
  ctx.putImageData(newImageData, 0, 0)


  try {
    return c.toDataURL()
  } catch(e) {
    console.log(e)
  }
  return
}
