import { useRef, useEffect } from 'react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"


function Calendar() {
  const PanelGroup = useRef(null)
  const onLayout = (sizes: number[]) => {
    console.log({sizes})
  }

  useEffect(() => {
    const pg = PanelGroup.current
    if (pg != null) {
      console.log(pg.getLayout())
    }
  }, [])

  return (
    <div className="h-[300px]">
      <ResizablePanelGroup
        direction="vertical"
        onLayout={onLayout}
        ref={PanelGroup}
      >
        <ResizablePanel>One</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Two</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default function Schedule() {
  return (
    <main>
      hi
      <Calendar/>
    </main>
  )
}
