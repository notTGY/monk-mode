let allImages = []
let shouldPixelate = true
const toggleShown = () => {
  console.log('toggling')
  shouldPixelate = shouldPixelate ^ true
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
    return null
  }
  try {
  const res = await pixelify(image)
  } catch(e) {
    console.log(e)
    return null
  }

  if (res) {
    image.setAttribute('data-og-src', image.src)
    image.setAttribute('data-pixelated-src', res)
    if (shouldPixelate) {
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

let isBusyPixelating = false
const tryPixelating = async () => {
  if (isBusyPixelating) {
    return
  }
  isBusyPixelating = true
  const images = [...document.querySelectorAll(
    'img'
  )]
  const processedImages = await Promise.all(
    images
      .filter(image => !allImages.includes(image))
      .map(processImage)
  )
  allImages = allImages.concat(
    processedImages.filter(item => item != null)
  )
  isBusyPixelating = false
}


const attachTelegramScroll = () => {
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


const init = () => {
  if (typeof window.__PixelateInited != 'undefined') {
    return
  }
  window.__PixelateInited = true

  document.addEventListener('scroll', () => {
    tryPixelating()
    attachTelegramScroll()
  })

  document.addEventListener('mousemove', () => {
    tryPixelating()
    attachTelegramScroll()
  })

  document.addEventListener('click', () => {
    tryPixelating()
    attachTelegramScroll()
  })

  tryPixelating()
  attachTelegramScroll()
  //setInterval(addAttributes, 1000)
}

document.body.onload = init
init()
