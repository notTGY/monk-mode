export interface Website {
  icon: string;
  title: string;
  url: string;
  id: number;
}

const mockWebsiteInfo: Website = {
  icon: "",
  title: "Who are you? We don't know you - Gmail",
  url: "chrome-extension://dahpciklgjejlidilfhgonackmmodkao/dist/options.html",
  id: 0,
}

export const fetchWebsiteInfo = async (): Promise<Website> => {
  return new Promise((resolve, reject) => {
    if (typeof chrome.tabs == 'undefined') {
      if (import.meta.env.DEV) {
        resolve(mockWebsiteInfo)
        return
      }
      reject(new Error('Not running in chrome extension'))
      return
    }
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
        return
      }

      if (tabs.length > 0) {
        const tab = tabs[0]
        resolve({
          icon: tab.favIconUrl || '', // The favicon URL of the page
          title: tab.title || '',     // The title of the page
          url: tab.url || '',         // The URL of the page
          id: tab.id || 0,
        })
      } else {
        reject(new Error('No active tab found'))
      }
    })
  })
}
