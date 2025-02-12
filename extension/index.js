const DEBUG = false

const ALLOW = 'allow'
const BLOCK = 'block'
const DETECT = 'detect'

let allImages = []
let currentStatus = ALLOW
let currentFilter = 'pixelify'
let nudeDetection = false

const toggleShown = async () => {
  if (currentStatus == BLOCK) {
    currentStatus = ALLOW
  } else {
    currentStatus = BLOCK
  }
  if (DEBUG) {
    console.log('toggling pixelation')
    console.log({currentStatus})
  }

  for (const image of allImages) {
    if (currentStatus == BLOCK) {
      image.src = image.getAttribute('data-pixelated-src')
      continue
    }
    image.src = image.getAttribute('data-og-src')
  }
  if (currentStatus != ALLOW) {
    await setupListeners()
  } else if (currentStatus == ALLOW) {
    unbindListeners()
  }
}

const processImage = async (image) => {
  if (!image || !image.src || image.getAttribute('data-substituted')) {
    return null
  }
  let res
  try {
    switch (currentFilter) {
      default:
        if (DEBUG) {
          console.error('unknown filter', currentFilter)
        }
      case 'pixelify':
        res = await loadAndThen(image, pixelify)
        break
      case 'darken':
        res = await loadAndThen(image, darken)
        break
    }
  } catch(e) {
    console.log('Pixelify error: ', e)
    return null
  }
  if (nudeDetection && currentStatus == DETECT) {
    if (await loadAndThen(image, nude)) {
      image.setAttribute('data-nude', true)
      if (DEBUG) {
        console.log('detected NUDES')
        image.style.border = '8px solid red'
      }
    }
  }

  if (res) {
    image.setAttribute('data-og-src', image.src)
    image.setAttribute('data-pixelated-src', res)
    if (currentStatus == BLOCK) {
      image.src = res
      if (image.srcset) {
        image.srcset = ''
      }
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
  if (DEBUG) {
    console.log(
      'errors',
      processedImages
        .filter(item => item.status == 'rejected')
    )
  }
  const newImages = processedImages
    .filter(item => item.status == 'fulfilled')
    .map(item => item.value)
    .filter(item => item != null)

  allImages = allImages.concat(newImages)

  if (currentStatus == DETECT) {
    if (DEBUG) {
      console.log('collecting detected')
    }
    if (newImages.some(im => im.getAttribute('data-nude'))) {
      for (const image of allImages) {
        image.src = image.getAttribute('data-pixelated-src')
      }
      currentStatus = BLOCK
      document.documentElement.setAttribute(
        'data-pixelify-inited', true
      )
      if (DEBUG) {
        console.log({currentStatus})
      }
    }
  }
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
  if (currentStatus == BLOCK) {
    document.documentElement.setAttribute(
      'data-pixelify-inited', true
    )
  }

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
  init(url)
  /*
  const shouldPixelate = await getCurrentRulePixelation(e.destination.url)
  currentStatus = shouldPixelate ? BLOCK : DETECT

  if (DEBUG) {
    console.log({currentStatus})
  }

  for (const image of allImages) {
    image.src = image.getAttribute(
      currentStatus == BLOCK
        ? 'data-pixelated-src'
        : 'data-og-src'
    )
  }

  if (currentStatus == BLOCK) {
    setupListeners()
  }
  */
})

const init = async (url) => {
  if (typeof window.__PixelifyInited != 'undefined') {
    return
  }
  window.__PixelifyInited = true

  if (DEBUG) {
    console.log('initializing')
  }

  currentFilter = (await storageArea.get(
    'currentFilter'
  )).currentFilter ?? ''
  nudeDetection = (await storageArea.get(
    'nudeDetection'
  )).nudeDetection ?? false

  const shouldPixelate = await getCurrentRulePixelation(url)
  currentStatus = shouldPixelate ? BLOCK : DETECT
  if (DEBUG) {
    console.log({currentStatus})
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
          const shouldPixelate = currentStatus == BLOCK
          if (DEBUG) {
            console.log({currentStatus})
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

  for (const image of allImages) {
    image.src = image.getAttribute(
      currentStatus == BLOCK
        ? 'data-pixelated-src'
        : 'data-og-src'
    )
  }

  if (currentStatus != ALLOW) {
    setupListeners()
  }
}

document.body.onload = () => init(location.href)
init(location.href)
