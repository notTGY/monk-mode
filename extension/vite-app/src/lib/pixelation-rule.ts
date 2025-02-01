import { fetchIsBlocklisted } from '@/lib/blocklist'
import { fetchSchedule } from '@/lib/schedule'

export const getCurrentRulePixelation = async (
  rawUrl: string, now: Date,
) => {
  const schedule = await fetchSchedule()
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
    for (const range of ranges) {
      const [rstart, rend] = range.split('-')
      const [h0, m0] = rstart.split(':')
      const [h1, m1] = rend.split(':')

      const t0 = +m0 + 60*(+h0)
      const t1 = +m1 + 60*(+h1)
      if (t0 <= t && t1 >= t) {
        return false
      }
    }
  }


  const url = new URL(rawUrl)
  const currentHostname = url.hostname
  const currentUrl = url.href

  const isBlocklistedHostname = await fetchIsBlocklisted(
    { hostname: currentHostname },
  )
  const isBlocklistedUrl = await fetchIsBlocklisted(
    { url: currentUrl },
  )
  return !!(isBlocklistedHostname || isBlocklistedUrl)
}
