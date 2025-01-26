type TStorage = any // eslint-disable-line @typescript-eslint/no-explicit-any
export let storage: TStorage

if (import.meta.env.DEV) {
  const local_key = 'chrome'
  storage = {
    get() {
      return new Promise((res) => {
        let val: TStorage = {}
        const v = localStorage.getItem(local_key)
        if (v != null) {
          try {
            val = JSON.parse(v)
          } catch(e) {
            console.log('storage error', e)
          }
        }
        res(val)
      })
    },
    set(val: object) {
      return new Promise((res) => {
        let oldVal: TStorage = {}
        const v = localStorage.getItem(local_key)
        if (v != null) {
          try {
            oldVal = JSON.parse(v)
          } catch(e) {
            console.log('storage error', e)
          }
        }
        res(localStorage.setItem(
          local_key, JSON.stringify(
            Object.assign(oldVal, val),
          ),
        ))
      })
    }
  }
} else {
  storage = chrome.storage.local
}
