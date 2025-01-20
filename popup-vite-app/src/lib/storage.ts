export let storage: any

if (import.meta.env.DEV) {
  const local_key = 'chrome'
  storage = {
    get(key: string) {
      return new Promise((res, _) => {
        let val: any = {}
        const v = localStorage.getItem(local_key)
        if (v != null) {
          try {
            val = JSON.parse(v)
            val = val[key]
          } catch(e) { }
        }
        res(val)
      })
    },
    set(val: Object) {
      return new Promise((res, _) => {
        let oldVal: any = {}
        const v = localStorage.getItem(local_key)
        if (v != null) {
          try {
            oldVal = JSON.parse(v)
          } catch(e) { }
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
