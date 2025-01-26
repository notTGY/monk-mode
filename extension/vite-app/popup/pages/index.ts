import Main from './Main'
import Settings from './Settings'

export const pages: string[] = [
  "main",
  "settings",
]
export const page_to_component: Record<string, any> = {
  main: Main,
  settings: Settings,
}
