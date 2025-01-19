import Main from '@/pages/Main'
import Settings from '@/pages/Settings'

export const pages: string[] = [ "Main", "Settings" ]
export const page_to_title: Record<string, string> = {
  "Main": "Main",
  "Settings": "Settings",
}
export const page_to_component: Record<string, any> = {
  "Main": Main,
  "Settings": Settings,
}
