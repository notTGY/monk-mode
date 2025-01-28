export const togglePixelation = async (id: number) => {
  const message = { action: 'toggle' }

  if (typeof chrome.tabs == 'undefined') {
    if (import.meta.env.DEV) {
      console.log('Sending to script', message)
      return
    }
    throw new Error('Not running in chrome extension')
    return
  }
  try {
    await chrome.tabs.sendMessage(id, message)
  } catch(e) {
    console.log(e)
  }
}

const mockStatus = false
export const fetchPixelation = async (id: number): Promise<boolean> => {
  const message = {action:'requestStatus'}
  if (typeof chrome.tabs == 'undefined') {
    if (import.meta.env.DEV) {
      console.log('Sending to script', message)
      return mockStatus
    }
    throw new Error('Not running in chrome extension')
  }
  let res = { shouldPixelate: false }
  try {
    res = await chrome.tabs.sendMessage(id, message)
  } catch(e) {
    console.log(e)
  }
  const shouldPixelate = res.shouldPixelate
  return shouldPixelate
}
