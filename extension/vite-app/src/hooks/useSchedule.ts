import { useState, useEffect } from 'react'
import { fetchSchedule, changeSchedule } from '@/lib/schedule'

export function useSchedule() {
  const [isLoading, setIsLoading] = useState(true)
  const [is9to5, setIs9to5] = useState(false)

  useEffect(() => {
    fetchSchedule().then((schedule) => {
      setIs9to5(!!schedule.is9to5)
      setIsLoading(false)
    })
  }, [])

  const on9to5Change = (newIs9to5: boolean) => {
    setIsLoading(true)
    setIs9to5(newIs9to5)
    changeSchedule(newIs9to5).then(() => {
      setIsLoading(false)
    })
  }

  return [
    isLoading,
    is9to5,
    on9to5Change,
  ]
}
