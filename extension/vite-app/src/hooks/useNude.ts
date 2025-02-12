import { useState, useEffect } from 'react'
import {
  fetchNudeDetection,
  setNudeDetection,
} from '@/lib/nude-detection'

export function useNude() {
  const [isLoading, setIsLoading] = useState(true)
  const [isNude, setIsNude] = useState(false)

  useEffect(() => {
    fetchNudeDetection().then(res => {
      setIsNude(res)
      setIsLoading(false)
    })
  }, [])

  const onToggle = (newIsNude: boolean) => {
    setIsLoading(true)
    setIsNude(newIsNude)

    setNudeDetection(newIsNude).then(() => {
      setIsLoading(false)
    })
  }

  return [
    isLoading,
    isNude,
    onToggle,
  ]
}

