import { storage } from '@/lib/storage'
import { sleep } from '@/lib/utils'

import pixelify from '@/assets/pixelify.webp'
import darken from '@/assets/darken.webp'

export const FILTERS = [
  "pixelify",
  "darken",
]

export const IMAGES = {
  pixelify,
  darken,
}

export const getCurrentFilter = async (): Promise<string> => {
  if (import.meta.env.DEV) {
    await sleep()
  }
  const currentFilter = (await storage.get(
    'currentFilter'
  )).currentFilter ?? ''
  return currentFilter
}

export const setCurrentFilter = async (newFilter: string) => {
  await storage.set({currentFilter: newFilter})
}
