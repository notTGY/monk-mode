import { useState, useEffect } from 'react'
import { Website, fetchWebsiteInfo } from '@/lib/website-info'

export const useCurrentWebsite = (): [boolean, Website|null] => {
  const [
    isLoadingWebsite, setIsLoadingWebsite
  ] = useState(true)
  const [website, setWebsite] = useState<Website | null>(null)

  useEffect(() => {
    const loadWebsiteInfo = async () => {
      const data = await fetchWebsiteInfo()
      setWebsite(data)
      setIsLoadingWebsite(false)
    }
    loadWebsiteInfo()
  }, [])


  return [isLoadingWebsite, website]
}
