const processImage = (image) => {
  if (!image || !image.src || image.getAttribute('data-substituted')) {
    return
  }
  return pixelate(image).then(res => {
    if (res) {
      image.setAttribute('data-og-src', image.src)
      image.setAttribute('data-pixelated-src', res)
      image.src = res
      if (image.srcset) {
        image.srcset = ''
      }
      image.setAttribute('data-substituted', true)
      

      /*
      image.addEventListener('mouseenter', () => {
        image.src = image.getAttribute('data-og-src')
      })
      image.addEventListener('mouseleave', () => {
        image.src = image.getAttribute('data-pixelated-src')
      })
      */
    }
  })
}
const tryPixelating = () => {
  const images = document.querySelectorAll('img')
  const promises = []
  for (const image of images) {
    promises.push(processImage(image))
  }
  Promise.all(promises)
}


document.addEventListener('scroll', () => {
  tryPixelating()
})


document.addEventListener('mousemove', () => {
  tryPixelating()
  attachScroll()
})

const attachScroll = () => {
  const els = document.querySelectorAll(
    '.custom-scroll'
  )
  for (const el of els) {
    if (el.getAttribute('data-pixelate-mounted')) {
      continue
    }
    el.setAttribute('data-pixelate-mounted', true)

    el.addEventListener('scroll', tryPixelating)
  }
}

document.body.onload = () => {
  tryPixelating()
  attachScroll()
}
document.addEventListener('click', () => {
  tryPixelating()
  attachScroll()
})

tryPixelating()
attachScroll()
//setInterval(addAttributes, 1000)
