const DEBUG = false

let allImages = []
let shouldPixelate = false

const toggleShown = async () => {
  if (DEBUG) {
    console.log('toggling pixelation')
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
  } else {
    unbindListeners()
  }
}

const processImage = async (image) => {
  if (!image || !image.src || image.getAttribute('data-substituted')) {
    return null
  }
  let res
  try {
    res = await darken(image)
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



let telegramScrollElements = []
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
    telegramScrollElements.push(el)
  }
}

const onEvent = () => {
  tryPixelating()
  attachTelegramScroll()
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

  document.addEventListener('scroll', onEvent)
  document.addEventListener('mousemove', onEvent)
  document.addEventListener('click', onEvent)

  await tryPixelating()
  attachTelegramScroll()
  //setInterval(addAttributes, 1000)
}

const unbindListeners = () => {
  if (!__setupInited) {
    return
  }
  __setupInited = false
  document.documentElement.removeAttribute(
    'data-pixelify-inited'
  )

  document.removeEventListener('scroll', onEvent)
  document.removeEventListener('mousemove', onEvent)
  document.removeEventListener('click', onEvent)

  for (const el of telegramScrollElements) {
    el.removeEventListener('scroll', tryPixelating)
    el.removeAttribute('data-pixelify-mounted')
  }
  telegramScrollElements = []
}

navigation.addEventListener('navigate', async (e) => {
  const url = new URL(e.destination.url)
  shouldPixelate = await getCurrentRulePixelation(e.destination.url)

  for (const image of allImages) {
    image.src = image.getAttribute(
      shouldPixelate
        ? 'data-pixelated-src'
        : 'data-og-src'
    )
  }

  if (shouldPixelate) {
    setupListeners()
  }
})

const init = async () => {
  if (typeof window.__PixelifyInited != 'undefined') {
    return
  }
  window.__PixelifyInited = true

  if (DEBUG) {
    console.log('initializing')
  }

  shouldPixelate = await getCurrentRulePixelation(location.href)
  if (DEBUG) {
    console.log({shouldPixelate})
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
          if (DEBUG) {
            console.log({shouldPixelate})
          }
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
