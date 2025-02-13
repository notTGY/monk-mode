const storageArea = chrome.storage.local

const getCurrentNudeDetection = async () => {
  const now = new Date()
  const schedule = (await storageArea.get(
    'schedule'
  )).schedule ?? {}
  const is9to5 = !!schedule.is9to5
  const isRange = !!schedule.isRange
  const ranges = schedule.ranges || []

  const currentHour = now.getHours()
  const isCurrent9to5 = currentHour >= 9 && currentHour <= 16
  if (is9to5 && !isCurrent9to5) {
    return false
  }

  if (isRange) {
    const currentMinute = now.getMinutes()
    const t = currentMinute + currentHour * 60
    let isIn = false
    for (const range of ranges) {
      const [rstart, rend] = range.split('-')
      const [h0, m0] = rstart.split(':')
      let [h1, m1] = rend.split(':')
      if ((+h1) == 0 && (+m1) == 0) {
        h1 = 24
        m1 = 0
      }

      const t0 = +m0 + 60*(+h0)
      const t1 = +m1 + 60*(+h1)
      if (t >= t0 && t <= t1) {
        isIn = true
      }
    }
    if (!isIn) {
      return false
    }
  }

  const nudeDetection = (await storageArea.get(
    'nudeDetection'
  )).nudeDetection ?? false
  return nudeDetection
}

const getCurrentRulePixelation = async (rawUrl) => {
  const now = new Date()
  const schedule = (await storageArea.get(
    'schedule'
  )).schedule ?? {}
  const is9to5 = !!schedule.is9to5
  const isRange = !!schedule.isRange
  const ranges = schedule.ranges || []

  const currentHour = now.getHours()
  const isCurrent9to5 = currentHour >= 9 && currentHour <= 16
  if (is9to5 && !isCurrent9to5) {
    return false
  }

  if (isRange) {
    const currentMinute = now.getMinutes()
    const t = currentMinute + currentHour * 60
    let isIn = false
    for (const range of ranges) {
      const [rstart, rend] = range.split('-')
      const [h0, m0] = rstart.split(':')
      let [h1, m1] = rend.split(':')
      if ((+h1) == 0 && (+m1) == 0) {
        h1 = 24
        m1 = 0
      }

      const t0 = +m0 + 60*(+h0)
      const t1 = +m1 + 60*(+h1)
      if (t >= t0 && t <= t1) {
        isIn = true
      }
    }
    if (!isIn) {
      return false
    }
  }

  const url = new URL(rawUrl)
  const currentHostname = url.hostname
  const currentUrl = url.href

  const blocklistedHostnames = (await storageArea.get(
    'blocklistedHostnames'
  )).blocklistedHostnames ?? {}
  const blocklistedUrls = (await storageArea.get(
    'blocklistedUrls'
  )).blocklistedUrls ?? {}

  return blocklistedHostnames[currentHostname] ||
    blocklistedUrls[currentUrl]
}
