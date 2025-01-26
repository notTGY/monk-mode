import { storage } from '@/lib/storage'

const sleep = async (): Promise<void> => new Promise(
  (res) => setTimeout(res, 1000),
)

type TBlocklist = Record<string, boolean>
export const getCurrentBlocklistedHostnames = async (): Promise<TBlocklist> => {
  const blocklistedHostnames = (await storage.get(
    'blocklistedHostnames'
  )).blocklistedHostnames ?? {}
  if (import.meta.env.DEV) {
    await sleep()
  }
  return blocklistedHostnames
}
export const getCurrentBlocklistedUrls = async (): Promise<TBlocklist> => {
  const blocklistedUrls = (await storage.get(
    'blocklistedUrls'
  )).blocklistedUrls ?? {}
  if (import.meta.env.DEV) {
    await sleep()
  }
  return blocklistedUrls
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
