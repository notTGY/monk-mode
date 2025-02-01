import { useState, useEffect } from 'react'
import { fetchSchedule, changeSchedule } from '@/lib/schedule'

export function useSchedule() {
  const [isLoading, setIsLoading] = useState(true)
  const [is9to5, setIs9to5] = useState(false)
  const [isRange, setIsRange] = useState(false)
  const [ranges, setRanges] = useState<string[]>([])

  const [initialRanges, setInitialRanges] = useState<string[]>([])

  useEffect(() => {
    fetchSchedule().then((schedule) => {
      setIs9to5(!!schedule.is9to5)
      setIsRange(!!schedule.isRange)
      if (schedule.ranges) {
        setRanges(schedule.ranges)
        setInitialRanges(schedule.ranges)
      } else {
        setRanges(['09:00-17:00'])
        setInitialRanges(['09:00-17:00'])
      }
      setIsLoading(false)
    })
  }, [])

  const on9to5Change = (newIs9to5: boolean) => {
    setIsLoading(true)
    setIs9to5(newIs9to5)
    const newIsRange = newIs9to5 ? false : isRange
    if (newIs9to5) {
      setIsRange(newIsRange)
    }

    changeSchedule({
      is9to5: newIs9to5,
      isRange: newIsRange,
      ranges,
    }).then(() => {
      setIsLoading(false)
    })
  }
  const onIsRangeChange = (newIsRange: boolean) => {
    setIsLoading(true)
    setIsRange(newIsRange)
    const newIs9to5 = newIsRange ? false : is9to5
    if (newIsRange) {
      setIs9to5(newIs9to5)
    }

    changeSchedule({
      is9to5: newIs9to5,
      isRange: newIsRange,
      ranges,
    }).then(() => {
      setIsLoading(false)
    })
  }
  const onRangesChange = (newRanges: string[], propagate: boolean) => {
    setIsLoading(true)
    setRanges(newRanges)
    if (propagate) {
      setInitialRanges(newRanges)
    }
    changeSchedule({
      is9to5,
      isRange,
      ranges: newRanges,
    }).then(() => {
      setIsLoading(false)
    })
  }

  return [
    isLoading,
    is9to5,
    on9to5Change,
    isRange,
    onIsRangeChange,
    initialRanges,
    onRangesChange,
  ]
}
