import { useState, useEffect } from 'react'

import { Website } from '@/lib/website-info'
import {
  fetchIsBlocklisted,
  block,
  unblock,
} from '@/lib/blocklist'

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
    await block({hostname})
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
    await unblock({hostname})
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
    await block({url})
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
    await unblock({url})
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
      const isUrlBlocked = await fetchIsBlocklisted({url})
      setIsUrlBlocked(isUrlBlocked)

      const isHostnameBlocked = await fetchIsBlocklisted({hostname})
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
