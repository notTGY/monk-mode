import React from 'react'

import Blocklist from './Blocklist'
import Schedule from './Schedule'
import Filter from './Filter'
import Nude from './Nude'

export const pages: string[] = [
  "blocklist",
  "schedule",
  "filter",
  "nude",
]
export const page_to_component: Record<string, React.FC> = {
  blocklist: Blocklist,
  schedule: Schedule,
  filter: Filter,
  nude: Nude,
}
