import React from 'react'

import Blocklist from './Blocklist'
import Schedule from './Schedule'
import Filter from './Filter'

export const pages: string[] = [
  "blocklist",
  "schedule",
  "filter",
]
export const page_to_component: Record<string, React.FC> = {
  blocklist: Blocklist,
  schedule: Schedule,
  filter: Filter,
}
