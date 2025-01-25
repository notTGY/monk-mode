const DEBUG = false

const storageArea = chrome.storage.local

let allImages = []
let shouldPixelate = false

const toggleShown = async () => {
  if (DEBUG) {
    console.log('toggling')
  }
  shouldPixelate = !!(shouldPixelate ^ true)

  for (const image of allImages) {
    image.src = image.getAttribute(
      shouldPixelate
        ? 'data-pixelated-src'
        : 'data-og-src'
    )
  }
  if (shouldPixelate) {
    await setupListeners()
  }
}

const processImage = async (image) => {
  if (!image || !image.src || image.getAttribute('data-substituted')) {
    return null
  }
  let res
  try {
    res = await pixelify(image)
  } catch(e) {
    console.log('Pixelify error: ', e)
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
  const processedImages = await Promise.allSettled(
    images
      .filter(image => !allImages.includes(image))
      .map(processImage)
  )
  allImages = allImages.concat(
    processedImages
      .filter(item => item.status == 'fulfilled')
      .map(item => item.value)
      .filter(item => item != null)
  )
  isBusyPixelating = false
}


const attachTelegramScroll = () => {
  if (location.host != 'web.telegram.org') return 

  const els = document.querySelectorAll(
    '.custom-scroll'
  )
  for (const el of els) {
    if (el.getAttribute('data-pixelify-mounted')) {
      continue
    }
    el.setAttribute('data-pixelify-mounted', true)

    el.addEventListener('scroll', tryPixelating)
  }
}

let __setupInited = false
const setupListeners = async () => {
  if (__setupInited) {
    return
  }
  __setupInited = true
  document.documentElement.setAttribute(
    'data-pixelify-inited', true
  )

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

  await tryPixelating()
  attachTelegramScroll()
  //setInterval(addAttributes, 1000)
}

const init = async () => {
  if (typeof window.__PixelateInited != 'undefined') {
    return
  }
  window.__PixelateInited = true

  if (DEBUG) {
    console.log('initializing')
  }

  const currentHostname = location.hostname
  const currentUrl = location.href

  const blocklistedHostnames = (await storageArea.get(
    'blocklistedHostnames'
  )).blocklistedHostnames ?? {}
  const blocklistedUrls = (await storageArea.get(
    'blocklistedUrls'
  )).blocklistedUrls ?? {}

  if (
    blocklistedHostnames[currentHostname]
    || blocklistedUrls[currentUrl]
  ) {
    shouldPixelate = true
  }

  chrome.runtime.onMessage.addListener(
    async (mes, sender, sendResponse) => {
      if (DEBUG) {
        console.log('message', mes)
      }
      switch (mes.action) {
        case 'toggle':
          await toggleShown()
          break
        case 'requestStatus':
          await sendResponse({shouldPixelate})
          break
        default:
          throw new Error('Unknown action: ' + mes.action)
      }
      sendResponse(true)
      if (DEBUG) {
        console.log('Responded')
      }
    },
  )


  if (shouldPixelate) {
    setupListeners()
  }
}

document.body.onload = init
init()
