const c = document.createElement('canvas')
const ctx = c.getContext('2d', { willReadFrequently: true })

const loadAndThen = (image, cb) => new Promise(
  (resolve, reject) => {
    setTimeout(reject.bind(null, 'timeout'), 500)
  const newImage = new Image()
  newImage.width = image.width
  newImage.height = image.height
  newImage.setAttribute('crossorigin', 'anonymous')

  newImage.onload = () => {
    const res = cb(newImage)
    resolve(res)
  }
  newImage.onerror = reject
  try {
    newImage.src = image.src
  } catch(e) {
    reject(e)
  }
})
