import React, { useState, useEffect } from 'react'

import { togglePixelation, fetchPixelation } from '@/lib/pixelation'
import { Website } from '@/lib/website-info'

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
      const data = await fetchPixelation(id)
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
      const data = await fetchPixelation(id)
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
