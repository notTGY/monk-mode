import { storage } from '@/lib/storage'
import { sleep } from '@/lib/utils'

type TBlocklist = Record<string, boolean>
export const getCurrentBlocklistedHostnames = async (): Promise<TBlocklist> => {
  if (import.meta.env.DEV) {
    await sleep()
  }
  const blocklistedHostnames = (await storage.get(
    'blocklistedHostnames'
  )).blocklistedHostnames ?? {}
  return blocklistedHostnames
}
export const getCurrentBlocklistedUrls = async (): Promise<TBlocklist> => {
  if (import.meta.env.DEV) {
    await sleep()
  }
  const blocklistedUrls = (await storage.get(
    'blocklistedUrls'
  )).blocklistedUrls ?? {}
  return blocklistedUrls
}

export const fetchIsBlocklisted = async (
  req: { hostname?: string, url?: string },
): Promise<boolean> => {
  if (req.hostname) {
    const blocklistedHostnames = await getCurrentBlocklistedHostnames()
    return req.hostname in blocklistedHostnames
  }
  if (req.url) {
    const blocklistedUrls = await getCurrentBlocklistedUrls()
    return req.url in blocklistedUrls
  }
  return false
}


type BlocklistProp = { hostname?: string, url?: string }

export const block = async ({
  hostname, url,
}: BlocklistProp): Promise<void> => {
  if (hostname) {
    const blocklistedHostnames = await getCurrentBlocklistedHostnames()
    blocklistedHostnames[hostname] = true
    await storage.set({blocklistedHostnames})
    return
  }
  if (url) {
    const blocklistedUrls = await getCurrentBlocklistedUrls()
    blocklistedUrls[url] = true
    await storage.set({blocklistedUrls})
    return
  }
  throw new Error('No url and hostname')
  return
}

export const unblock = async ({
  hostname, url,
}: BlocklistProp): Promise<void> => {
  if (hostname) {
    const blocklistedHostnames = await getCurrentBlocklistedHostnames()
    if (hostname in blocklistedHostnames) {
      delete blocklistedHostnames[hostname]
    }
    await storage.set({blocklistedHostnames})
    return
  }
  if (url) {
    const blocklistedUrls = await getCurrentBlocklistedUrls()
    if (url in blocklistedUrls) {
      delete blocklistedUrls[url]
    }
    await storage.set({blocklistedUrls})
    return
  }
  throw new Error('No url and hostname')
  return
}
