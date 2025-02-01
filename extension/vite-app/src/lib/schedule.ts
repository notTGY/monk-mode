import { storage } from '@/lib/storage'
import { sleep } from '@/lib/utils'

type TShedule = {
  is9to5: boolean
  isRange: boolean
  ranges: string[]
}

export const fetchSchedule = async (): Promise<TShedule> => {
  if (import.meta.env.DEV) {
    await sleep()
  }
  const schedule = (await storage.get(
    'schedule'
  )).schedule ?? {}
  return schedule
}

export const changeSchedule = async (schedule: TShedule) => {
  console.log({schedule})
  await storage.set({schedule})
}

