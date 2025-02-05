import { useState, useEffect } from 'react'
import {
  FILTERS,
  getCurrentFilter,
  setCurrentFilter,
} from '@/lib/filter'

export function useFilter() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getCurrentFilter().then(res => {
      const idx = Math.max(FILTERS.indexOf(res), 0)
      setSelectedIndex(idx)
      setIsLoading(false)
    })
  }, [])

  const next = () => {
    const newSelectedIndex = (selectedIndex + 1) % FILTERS.length
    setSelectedIndex(newSelectedIndex)

    setCurrentFilter(FILTERS[newSelectedIndex])
  }
  const prev = () => {
    const newSelectedIndex = (FILTERS.length + selectedIndex - 1) % FILTERS.length
    setSelectedIndex(newSelectedIndex)

    setCurrentFilter(FILTERS[newSelectedIndex])
  }

  const selected = FILTERS[selectedIndex]

  return [
    next,
    prev,
    isLoading,
    selected,
  ]
}
