let allImages = []
let isHidden = true
const toggleShown = () => {
  console.log('toggling')
  isHidden = isHidden ^ true
  if (isHidden) {
    for (const image of allImages) {
      image.src = image.getAttribute('data-pixelated-src')
    }
  } else {
    for (const image of allImages) {
      image.src = image.getAttribute('data-og-src')
    }
  }
}

console.log('initializing')
chrome.runtime.onMessage.addListener((mes) => {
  console.log('message', mes)
  if (mes.action == 'toggle') {
    toggleShown()
  }
})

const processImage = async (image) => {
  if (!image || !image.src || image.getAttribute('data-substituted')) {
    return
  }
  const res = await pixelate(image)

  if (res) {
    image.setAttribute('data-og-src', image.src)
    image.setAttribute('data-pixelated-src', res)
    if (isHidden) {
      image.src = res
    }
    if (image.srcset) {
      image.srcset = ''
    }
    image.setAttribute('data-substituted', true)
    return image
  }
  return null
}

let isBusy = false
const tryPixelating = async () => {
  if (isBusy) {
    return
  }
  isBusy = true
  const images = [...document.querySelectorAll(
    'img'
  )]
  const processedImages = await Promise.all(
    images.map(processImage)
  )
  allImages = allImages.concat(
    processedImages.filter(item => item != null)
  )
  isBusy = false
}


document.addEventListener('scroll', () => {
  tryPixelating()
})


document.addEventListener('mousemove', () => {
  tryPixelating()
  attachScroll()
})

const attachScroll = () => {
  if (location.host != 'web.telegram.org') return 

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
