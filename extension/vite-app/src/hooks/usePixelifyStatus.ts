import React, { useState, useEffect } from 'react'
import { Website } from '@/hooks/useCurrentWebsite'

const togglePixelation = async (id: number) => {
  const message = { action: 'toggle' }

  if (typeof chrome.tabs == 'undefined') {
    if (import.meta.env.DEV) {
      console.log('Sending to script', message)
      return
    }
    throw new Error('Not running in chrome extension')
    return
  }
  try {
    await chrome.tabs.sendMessage(id, message)
  } catch(e) {
    console.log(e)
  }
}


const fetchPixelifyStatus = async (id: number): Promise<boolean> => {
  const message = {action:'requestStatus'}
  const res = await chrome.tabs.sendMessage(id, message)
  const shouldPixelate = res.shouldPixelate
  return shouldPixelate
}

export const usePixelifyStatus = (
  isLoadingWebsite: boolean,
  website: Website,
): [
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

  const id = website?.id || 0

  useEffect(() => {
    const loadPixelifyStatus = async () => {
      const data = await fetchPixelifyStatus(id)
      setIsPixelifyActive(data)
      setIsLoadingPixelifyStatus(false)
    }
    if (!isLoadingWebsite) {
      loadPixelifyStatus()
    }
  }, [id, isLoadingWebsite])

  const onToggle = isLoadingWebsite
    ? () => {}
    : () => {
    setIsLoadingPixelifyStatus(true)
    togglePixelation(id).then(async () => {
      const data = await fetchPixelifyStatus(id)
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
