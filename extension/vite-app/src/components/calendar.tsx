import { clsx } from 'clsx'
import { useRef, useState, useEffect } from 'react'
import * as ResizablePrimitive from "react-resizable-panels"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"

import { useSchedule } from '@/hooks/useSchedule'

import { Event } from '@/components/calendar-event'

const MIN_SIZE = 3/24*100
const EPS = 100/(24*60)

const absoluteTimeFromStr = (str: string): number => {
  const [h, m] = str.split(':')
  return +m + 60*(+h)
}

const sizesFromRanges = (ranges: string[]): number[] => {
  if (ranges.length === 0) {
    return []
  }
  const times = ranges
    .map((r: string) => r.split('-'))
    .flat()
    .map(absoluteTimeFromStr)
  const t0 = times[0]
  let t1 = times[1]

  const l0 = t0*100 / (24*60)

  if (t1 == 0) {
    t1 = 24*60
  }
  let l1 = (t1-t0)*100 / (24*60)

  if (l1 < MIN_SIZE) {
    l1 = MIN_SIZE
  }

  return [l0, l1, 100-(l0+l1)]
}

const sizeToTime = (size: number) => {
  const h = Math.floor(24*size/100 % 24)
  const m = Math.floor(24*60*size/100 % 60)
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

const rangesFromSizes = (sizes: number[]): string[] => {
  const t0 = sizeToTime(sizes[0])
  const t1 = sizeToTime(sizes[0]+sizes[1])
  return [`${t0}-${t1}`]
}


const same = (sizes1: number[], sizes2: number[]) => {
  if (sizes1.length != sizes2.length) {
    return false
  }

  return sizes1.map((s1, i) => s1 - sizes2[i]).every(
    diff => Math.abs(diff) < EPS
  )
}


export function Calendar({
  disabled,
}: {
  disabled: boolean,
}) {
  const scheduleOpts = useSchedule()
  const ranges = scheduleOpts[5] as string[]
  const onRangesChange = scheduleOpts[6] as (newRanges: string[], propagate: boolean)=>void

  const PanelGroup = useRef<ResizablePrimitive.ImperativePanelGroupHandle | null>(null)
  const [localRanges, setLocalRanges] = useState(['09:00-17:00'])

  const [isLoading, setIsLoading] = useState(true)

  const onLocalRangesChange = (newRanges: string[]) => {
    setLocalRanges(newRanges)
    onRangesChange(newRanges, false)
  }

  useEffect(() => {
    if (isLoading && ranges.length > 0) {
      setLocalRanges(ranges)
      const newSizes = sizesFromRanges(ranges)
      const pg = PanelGroup.current
      if (pg) {
        pg.setLayout(newSizes)
      }
      setIsLoading(false)
    }
  }, [ranges, isLoading])

  const layout = sizesFromRanges(localRanges)

  const onLayout = (sizes: number[]) => {
    if (!same(sizes, layout) && !disabled) {
      const newRanges = rangesFromSizes(sizes)
      onLocalRangesChange(newRanges)
    }
  }

  const Events = layout.map((size, idx) => {
    const Handle = (
      <ResizableHandle
        key={`${idx}-handle`}
        className="data-[panel-group-direction=vertical]:h-0"
        withHandle={!disabled}
        disabled={disabled}
      />
    )
    const PanelSpacing = (
      <ResizablePanel
        key={`${idx}-spacing`}
        defaultSize={size}
      />
    )
    const PanelEvent = (
      <ResizablePanel
        key={`${idx}-event`}
        defaultSize={size}
        minSize={MIN_SIZE}
        className="px-3"
      >
      {disabled ? (
        <div className="w-full h-full bg-primary/80 rounded-lg"/>
      ) : (
        <Event
          idx={idx}
          range={localRanges[(idx-1)/2]}
          onChange={(range: string) => {
            const newRanges = [...localRanges]
            newRanges[(idx-1)/2] = range
            onLocalRangesChange(newRanges)
            const newSizes = sizesFromRanges(newRanges)
            const pg = PanelGroup.current
            if (pg) {
              pg.setLayout(newSizes)
            }
          }}
        />
      )}
      </ResizablePanel>
    )
    const children = [
      idx % 2 == 1 ? PanelEvent : PanelSpacing,
    ]
    if (idx < layout.length - 1) {
      children.push(Handle)
    }
    return children
  }).flat()

  return (
    <div className="relative">
      <div
        data-testid="calendar-times"
        data-disabled={disabled}
        className={clsx(
        "text-xs h-full w-full grid grid-cols-1 justify-between gap-3",
      {"text-muted-foreground": disabled},
      )}>
      {new Array(24).fill(0).map((_, i) => {
        return (
          <div key={i} className="w-full">
            {i.toString().padStart(2, '0')}:00
            <Separator/>
          </div>
        )
      })}
      </div>
      <ResizablePanelGroup
        direction="vertical"
        onLayout={onLayout}
        ref={PanelGroup}
        className="absolute top-0 ps-8"
      >
        {Events}
      </ResizablePanelGroup>
    </div>
  )
}
