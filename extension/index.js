const addAttributes = () => {
  const images = document.querySelectorAll('img')
  const promises = []
  for (const image of images) {
    if (image.getAttribute('data-substituted')) {
      continue
    }
    if (!image.src) {
      continue
    }
    promises.push(pixelate(image).then(res => {
      if (res) {
        image.src = res
        if (image.srcset) {
          image.srcset = ''
        }
        image.setAttribute('data-substituted', true)
      }
    }))
  }
  Promise.all(promises)
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

//setInterval(addAttributes, 1000)
