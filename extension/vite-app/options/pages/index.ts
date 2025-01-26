import Blocklist from './Blocklist'

export const pages: string[] = [
  "blocklist",
  //"schedule",
]
export const page_to_component: Record<string, any> = {
  blocklist: Blocklist,
  schedule: Blocklist,
}
