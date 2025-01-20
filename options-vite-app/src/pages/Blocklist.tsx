import React, { useState, useEffect } from "react"
import { BlocklistItem } from "@/components/blocklist-item"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import {
  getCurrentBlocklistedUrls,
  getCurrentBlocklistedHostnames,
  block,
  unblock,
} from '@/lib/blocklist'

export default function Blocklist() {
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
      setUrls(Object.keys(res))
      setIsUrlsLoading(false)
    })

    setHostnames([])
    setIsHostnamesLoading(true)
    getCurrentBlocklistedHostnames().then(res => {
      setHostnames(Object.keys(res))
      setIsHostnamesLoading(false)
    })
  }, [])

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault()
    if (newUrl && !urls.includes(newUrl)) {
      setUrls([...urls, newUrl])
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
      setHostnames([...hostnames, newHostname])
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
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Blocklist</h1>

      <Card>
        <CardHeader>
          <CardTitle>Blocklisted websites</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {isUrlsLoading && urls.length === 0 ? (
              <Skeleton className="h-4 w-[200px]" />
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
              placeholder="Add website to blocklist"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="flex-1"
              disabled={isUrlsLoading}
            />
            <Button
              type="submit"
              disabled={isUrlsLoading}
            >Add</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blocklisted domains</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {isHostnamesLoading && hostnames.length === 0 ? (
              <Skeleton className="h-4 w-[160px]" />
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
              placeholder="Add domain to blocklist"
              value={newHostname}
              onChange={(e) => setNewHostname(e.target.value)}
              className="flex-1"
              disabled={isHostnamesLoading}
            />
            <Button
              type="submit"
              disabled={isHostnamesLoading}
            >Add</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
