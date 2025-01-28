import React from 'react'
import Blocklist from './Blocklist'
import Schedule from './Schedule'

export const pages: string[] = [
  "blocklist",
  "schedule",
]
export const page_to_component: Record<string, React.FC> = {
  blocklist: Blocklist,
  schedule: Schedule,
}
