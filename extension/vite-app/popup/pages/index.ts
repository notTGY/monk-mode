import Main from './Main'
import Settings from './Settings'

export const pages: string[] = [
  "Main",
  //"Settings",
]
export const page_to_title: Record<string, string> = {
  "Main": "Main",
  "Settings": "Settings",
}
export const page_to_component: Record<string, any> = {
  "Main": Main,
  "Settings": Settings,
}
