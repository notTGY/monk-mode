import { useState, useEffect } from 'react'

import { Website } from '@/lib/website-info'
import {
  fetchIsBlocklisted,
  block,
  unblock,
} from '@/lib/blocklist'
import {
  getCurrentRulePixelation,
} from '@/lib/pixelation-rule'

export const useWebsiteBlocklist = (
  isLoadingWebsite: boolean, website: Website | null,
): [
  boolean,
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
  const [
    isRuleBlocked, setIsRuleBlocked,
  ] = useState(false)

  useEffect(() => {
    if (website?.url) {
      const now = new Date()
      getCurrentRulePixelation(
        website?.url || '', now,
      ).then((res) => {
        setIsRuleBlocked(res)
      })
    }
  }, [isHostnameBlocked, isUrlBlocked, website])

  const blockHostname = async () => {
    setIsLoading(true)
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
    setIsLoading(false)
  }

  const unblockHostname = async () => {
    setIsLoading(true)
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
    setIsLoading(false)
  }

  const blockUrl = async () => {
    setIsLoading(true)
    if (website == null) {
      throw new Error('Website is null')
    }
    const url = website.url
    if (!url) {
      throw new Error('Website url is null')
    }
    await block({url})
    setIsUrlBlocked(true)
    setIsLoading(false)
  }

  const unblockUrl = async () => {
    setIsLoading(true)
    if (website == null) {
      throw new Error('Website is null')
    }
    const url = website.url
    if (!url) {
      throw new Error('Website url is null')
    }
    await unblock({url})
    setIsUrlBlocked(false)
    setIsLoading(false)
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
    isRuleBlocked,
    urlAction,
    hostnameAction,
  ]
}
