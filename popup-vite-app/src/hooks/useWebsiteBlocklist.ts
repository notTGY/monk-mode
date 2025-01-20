import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'

import { Website } from '@/hooks/useCurrentWebsite'

type TBlocklist = Record<string, boolean>
const getCurrentBlocklistedHostnames = async (): Promise<TBlocklist> => {
  const blocklistedHostnames = (await storage.get(
    'blocklistedHostnames'
  )).blocklistedHostnames ?? {}
  return blocklistedHostnames
}
const getCurrentBlocklistedUrls = async (): Promise<TBlocklist> => {
  const blocklistedUrls = (await storage.get(
    'blocklistedUrls'
  )).blocklistedUrls ?? {}
  return blocklistedUrls
}

const fetchBlocklisted = async (
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

export const useWebsiteBlocklist = (
  isLoadingWebsite: boolean, website: Website | null,
): [
  boolean,
  boolean,
  boolean,
  React.MouseEventHandler<HTMLButtonElement>,
  React.MouseEventHandler<HTMLButtonElement>,
] => {
  const [isLoading, setIsLoading] = useState(true)

  const [
    isUrlBlocked, setIsUrlBlocked,
  ] = useState(false)
  const [
    isHostnameBlocked, setIsHostnameBlocked,
  ] = useState(false)

  const blockHostname = async () => {
    if (website == null) {
      throw new Error('Website is null')
    }
    const url = website.url
    if (!url) {
      throw new Error('Website url is null')
    }
    const hostname = new URL(url).hostname
    if (!hostname) {
      throw new Error('Website hostname is null')
    }

    const blocklistedHostnames = await getCurrentBlocklistedHostnames()

    blocklistedHostnames[hostname] = true

    await storage.set({blocklistedHostnames})

    setIsHostnameBlocked(true)
  }

  const unblockHostname = async () => {
    if (website == null) {
      throw new Error('Website is null')
    }
    const url = website.url
    if (!url) {
      throw new Error('Website url is null')
    }
    const hostname = new URL(url).hostname
    if (!hostname) {
      throw new Error('Website hostname is null')
    }

    const blocklistedHostnames = await getCurrentBlocklistedHostnames()

    if (hostname in blocklistedHostnames) {
      delete blocklistedHostnames[hostname]
    }

    await storage.set({blocklistedHostnames})

    setIsHostnameBlocked(false)
  }

  const blockUrl = async () => {
    if (website == null) {
      throw new Error('Website is null')
    }
    const url = website.url
    if (!url) {
      throw new Error('Website url is null')
    }

    const blocklistedUrls = await getCurrentBlocklistedUrls()

    blocklistedUrls[url] = true

    await storage.set({blocklistedUrls})

    setIsUrlBlocked(true)
  }

  const unblockUrl = async () => {
    if (website == null) {
      throw new Error('Website is null')
    }
    const url = website.url
    if (!url) {
      throw new Error('Website url is null')
    }

    const blocklistedUrls = await getCurrentBlocklistedUrls()

    if (url in blocklistedUrls) {
      delete blocklistedUrls[url]
    }

    await storage.set({blocklistedUrls})

    setIsUrlBlocked(false)
  }

  useEffect(() => {
    if (isLoadingWebsite || website == null) {
      setIsLoading(true)
      return () => {}
    }
    const url = website.url
    if (!url) {
      setIsLoading(true)
      return () => {}
    }
    const hostname = new URL(url).hostname

    const fetchBlocks = async () => {
      const isUrlBlocked = await fetchBlocklisted({url})
      setIsUrlBlocked(isUrlBlocked)

      const isHostnameBlocked = await fetchBlocklisted({hostname})
      setIsHostnameBlocked(isHostnameBlocked)

      setIsLoading(false)
    }
    fetchBlocks()

    return () => {}
  }, [website, isLoadingWebsite])

  const urlAction = isUrlBlocked
    ? unblockUrl
    : blockUrl
  const hostnameAction = isHostnameBlocked
    ? unblockHostname
    : blockHostname

  return [
    isLoading,
    isUrlBlocked,
    isHostnameBlocked,
    urlAction,
    hostnameAction,
  ]
}
