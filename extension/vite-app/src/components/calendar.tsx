import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import { useRef, useEffect, useState } from 'react'
import * as ResizablePrimitive from "react-resizable-panels"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const formatTime = (d: Date) => {
  return `${
    d.getHours().toString().padStart(2, '0')
  }:${
    d.getMinutes().toString().padStart(2, '0')
  }`
}

const getSizes = (st: Date, et: Date) => {
  const h0 = st.getHours()
  const m0 = st.getMinutes()
  const l0 = 100*(h0*60+m0) / (24*60)


  const h1 = et.getHours()
  const m1 = et.getMinutes()
  let l1 = 100*(h1*60+m1-h0*60-m0) / (24*60)

  if (l1 < 10) {
    l1 = 10
  }

  return [l0, l1, 100-(l0+l1)]
}

const timeFromStr = (str: string) => {
  const tv = str.split(':')
  const t = new Date()
  t.setHours(+tv[0])
  t.setMinutes(+tv[1])
  return t
}

const getTimes = (sizes: number[]) => {
  const startTime = new Date()
  startTime.setHours(24*sizes[0]/100)
  startTime.setMinutes(24*60*sizes[0]/100 % 60)

  const endTime = new Date()
  endTime.setHours(24*(sizes[0]+sizes[1])/100)
  endTime.setMinutes(24*60*(sizes[0]+sizes[1])/100 % 60)

  return [startTime, endTime]
}

const initialFromRanges = (ranges: string[]) => {
  const firstRange = ranges[0]
  const firstTimes = firstRange
    .split('-')
    .map(timeFromStr)
  const sizes = getSizes(firstTimes[0], firstTimes[1])
  return sizes
}

const minTime = 3

export function Calendar({
  isLoading,
  disabled,
  ranges,
  onRangesChange,
}: {
  isLoading: boolean,
  disabled: boolean,
  ranges: string[],
  onRangesChange: (newRanges: string[]) => void,
}) {
  const { t } = useTranslation('options', {
    keyPrefix: 'schedule.range'
  })
  const PanelGroup = useRef<ResizablePrimitive.ImperativePanelGroupHandle | null>(null)

  const initial = initialFromRanges(ranges)
  const [layout, setLayout] = useState(initial)

  useEffect(() => {
    const pg = PanelGroup.current
    if (pg != null && !isLoading) {
      const loaded = initialFromRanges(ranges)
      if (
        loaded
          .map((l, i) => l - layout[i])
          .some(l => l > 1)
      ) {
        pg.setLayout(loaded)
      }
    }
  }, [isLoading, ranges, layout])

  const updateRanges = (sizes: number[]) => {
    if (disabled) {
      return
    }
    if (
      sizes
        .map((l, i) => l - layout[i])
        .every(l => l < 1)
    ) {
      return
    }

    const times = getTimes(sizes)
    const str = times.map(formatTime).join('-')
    const newRanges = [str]
    onRangesChange(newRanges)
  }

  const onLayout = (sizes: number[]) => {
    setLayout(sizes)
    updateRanges(sizes)
  }

  const [startTime, endTime] = getTimes(layout)

  const resize = (sizes: number[]) => {
    const pg = PanelGroup.current
    if (pg == null) {
      return
    }
    setLayout(sizes)
    updateRanges(sizes)
    pg.setLayout(sizes)
  }


  const SelectedRange = (
    <div className="w-content flex gap-1">
      <div className="flex flex-col items-start justify-center gap-1">
        <Label htmlFor="tstart">{t('start')}</Label>
        <Input
          id="tstart"
          type="time"
          value={formatTime(startTime)}
          onChange={(e) => {
            const newTime = timeFromStr(e.target.value)
            resize(getSizes(newTime, endTime))
          }}
        />
      </div>
      <div className="flex flex-col items-end justify-center gap-1">
        <Label htmlFor="tend">{t('end')}</Label>
        <Input
          id="tend"
          type="time"
          value={formatTime(endTime)}
          onChange={(e) => {
            const newTime = timeFromStr(e.target.value)
            resize(getSizes(startTime, newTime))
          }}
        />
      </div>
    </div>
  )

  const Slots = (
    <ResizablePanelGroup
      direction="vertical"
      onLayout={onLayout}
      ref={PanelGroup}
      className="absolute top-0 ps-8"
    >
      <ResizablePanel
        defaultSize={layout[0]}
      />
      <ResizableHandle
        className="data-[panel-group-direction=vertical]:h-0"
        withHandle={!disabled}
        disabled={disabled}
      />
      <ResizablePanel
        defaultSize={layout[1]}
        className={clsx(
          "rounded-lg flex justify-center items-center text-lg text-primary-foreground",
          {"bg-primary/80": disabled},
          {"bg-primary": !disabled},
        )}
        minSize={minTime/24*100}
      >
      {disabled ? null : SelectedRange}
      </ResizablePanel>
      <ResizableHandle
        className="data-[panel-group-direction=vertical]:h-0"
        withHandle={!disabled}
        disabled={disabled}
      />
      <ResizablePanel
        defaultSize={layout[2]}
      />
    </ResizablePanelGroup>
  )

  return (
    <div className="relative">
      <div className={clsx(
      "text-xs h-full w-full grid grid-cols-1 justify-between gap-2 divide-y-[1px]",
      {"text-muted-foreground": disabled},
      )}>
      {new Array(24).fill(0).map((_, i) => {
        return (
          <div key={i} className="w-full">
            {i.toString().padStart(2, '0')}:00
          </div>
        )
      })}
      </div>
      {isLoading ? null : Slots}
    </div>
  )
}

