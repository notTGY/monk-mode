import React, { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'

const togglePixelation = async () => {
  const message = { action: 'toggle' }

  if (typeof chrome.tabs == 'undefined') {
    if (import.meta.env.DEV) {
      console.log('Sending to script', message)
      return
    }
    throw new Error('Not running in chrome extension')
    return
  }
  const tabs = await chrome.tabs.query({})

  await Promise.allSettled(
    tabs
      .filter(t => t.id)
      .map(tab => chrome.tabs.sendMessage(tab.id!, message))
  )
}


const fetchPixelifyStatus = async (): Promise<boolean> => {
  const obj: any = await storage.get('shouldPixelate')
  const shouldPixelate = obj.shouldPixelate
  return shouldPixelate
}

export const usePixelifyStatus = (): [
  boolean,
  boolean,
  React.MouseEventHandler<HTMLButtonElement>,
] => {
  const [
    isLoadingPixelifyStatus, setIsLoadingPixelifyStatus,
  ] = useState(true)
  const [
    isPixelifyActive, setIsPixelifyActive,
  ] = useState(false)

  useEffect(() => {
    const loadPixelifyStatus = async () => {
      const data = await fetchPixelifyStatus()
      setIsPixelifyActive(data)
      setIsLoadingPixelifyStatus(false)
    }
    loadPixelifyStatus()
  }, [])

  const onToggle = () => {
    setIsLoadingPixelifyStatus(true)
    togglePixelation().then(async () => {
      const data = await fetchPixelifyStatus()
      setIsPixelifyActive(data)
      setIsLoadingPixelifyStatus(false)
    })
  }

  return [
    isLoadingPixelifyStatus,
    isPixelifyActive,
    onToggle,
  ]
}
