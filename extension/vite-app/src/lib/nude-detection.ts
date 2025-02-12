import { storage } from '@/lib/storage'
import { sleep } from '@/lib/utils'

type TNudeDetection = boolean

export const fetchNudeDetection = async (): Promise<TNudeDetection> => {
  if (import.meta.env.DEV) {
    await sleep()
  }
  const nudeDetection = (await storage.get(
    'nudeDetection'
  )).nudeDetection ?? false
  return nudeDetection
}

export const setNudeDetection = async (nudeDetection: TNudeDetection) => {
  console.log({nudeDetection})
  await storage.set({nudeDetection})
}
