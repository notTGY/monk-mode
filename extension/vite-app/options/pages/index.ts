import Blocklist from './Blocklist'

export const pages: string[] = [
  "Blocklist",
  //"Schedule",
]
export const page_to_title: Record<string, string> = {
  "Blocklist": "Blocklist",
  "Schedule": "Schedule",
}
export const page_to_component: Record<string, any> = {
  "Blocklist": Blocklist,
  "Schedule": Blocklist,
}
