import React, { useState, useEffect } from "react"
import { BlocklistItem } from "@/components/blocklist-item"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslation } from 'react-i18next'

import {
  getCurrentBlocklistedUrls,
  getCurrentBlocklistedHostnames,
  block,
  unblock,
} from '@/lib/blocklist'

export default function Blocklist() {
  const { t } = useTranslation('options', {
    keyPrefix: 'blocklist',
  })
  const [urls, setUrls] = useState<string[]>([])
  const [hostnames, setHostnames] = useState<string[]>([])

  const [isUrlsLoading, setIsUrlsLoading] = useState(true)
  const [isHostnamesLoading, setIsHostnamesLoading] = useState(true)

  const [newUrl, setNewUrl] = useState("")
  const [newHostname, setNewHostname] = useState("")

  useEffect(() => {
    setUrls([])
    setIsUrlsLoading(true)
    getCurrentBlocklistedUrls().then(res => {
      const urls = Object.keys(res)
      urls.sort()
      setUrls(urls)
      setIsUrlsLoading(false)
    })

    setHostnames([])
    setIsHostnamesLoading(true)
    getCurrentBlocklistedHostnames().then(res => {
      const hostnames = Object.keys(res)
      hostnames.sort()
      setHostnames(hostnames)
      setIsHostnamesLoading(false)
    })
  }, [])

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault()
    if (newUrl && !urls.includes(newUrl)) {
      const newUrls = [...urls, newUrl]
      newUrls.sort()
      setUrls(newUrls)
      setIsUrlsLoading(true)
      block({ url: newUrl }).then(() => {
        setIsUrlsLoading(false)
        setNewUrl("")
      })
    }
  }

  const handleAddHostname = (e: React.FormEvent) => {
    e.preventDefault()
    if (newHostname && !hostnames.includes(newHostname)) {
      const newHostnames = [...hostnames, newHostname]
      newHostnames.sort()
      setHostnames(newHostnames)
      setIsHostnamesLoading(true)
      block({ hostname: newHostname }).then(() => {
        setIsHostnamesLoading(false)
        setNewHostname("")
      })
    }
  }

  const removeUrl = (url: string) => {
    setUrls(urls.filter((u) => u !== url))
    unblock({ url })
  }

  const removeHostname = (hostname: string) => {
    setHostnames(hostnames.filter((h) => h !== hostname))
    unblock({ hostname })
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">
        {t('title')}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('urls.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {urls.length === 0 ?
              isUrlsLoading ? (
                <Skeleton className="h-4 w-[200px]" />
              ) : (
                <p className="text-muted-foregound text-sm">
                  {t('urls.empty')}
                </p>
            ) : urls.map((url) => (
              <BlocklistItem
                key={url}
                value={url}
                onRemove={removeUrl}
              />
            ))}
          </div>
          <form
            onSubmit={handleAddUrl}
            className="flex gap-2"
          >
            <Input
              placeholder={t('urls.placeholder')}
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="flex-1"
              disabled={isUrlsLoading}
            />
            <Button
              type="submit"
              disabled={isUrlsLoading}
            >
              {t('urls.add')}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('hostnames.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {hostnames.length === 0 ?
              isHostnamesLoading ? (
                <Skeleton className="h-4 w-[160px]" />
              ) : (
                <p className="text-muted-foregound text-sm">
                  {t('hostnames.empty')}
                </p>
              ) : hostnames.map((hostname) => (
                <BlocklistItem
                  key={hostname}
                  value={hostname}
                  onRemove={removeHostname}
                />
              ))}
          </div>
          <form
            onSubmit={handleAddHostname}
            className="flex gap-2"
          >
            <Input
              placeholder={t('hostnames.placeholder')}
              value={newHostname}
              onChange={(e) => setNewHostname(e.target.value)}
              className="flex-1"
              disabled={isHostnamesLoading}
            />
            <Button
              type="submit"
              disabled={isHostnamesLoading}
            >
              {t('hostnames.add')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
