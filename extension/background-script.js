const DEFAULT_BLOCKLISTED_HOSTNAMES = {
  'web.telegram.org',
  'mail.google.com',
  'ya.ru',
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set(
    'blocklisted-hostnames', 
    DEFAULT_BLOCKLISTED_HOSTNAMES,
  )
})


chrome.runtime.onMessage.addEventListener(
  (mes, sender, sendResponse) => {
    switch (mes.action) {
      default:
        throw new Error(
          'Unknown action: ' + mes.action
        )
    }
  },
)
