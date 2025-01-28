import { fetchIsBlocklisted } from '@/lib/blocklist'
import { fetchSchedule } from '@/lib/schedule'

export const getCurrentRulePixelation = async (
  rawUrl: string, now: Date,
) => {
  const schedule = await fetchSchedule()
  const is9to5 = !!schedule.is9to5

  const currentHour = now.getHours()
  const isCurrent9to5 = currentHour >= 9 && currentHour <= 16
  if (is9to5 && !isCurrent9to5) {
    return false
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
