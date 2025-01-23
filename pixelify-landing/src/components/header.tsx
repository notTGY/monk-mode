import { Button } from "@/components/ui/button"
import { ModeToggle } from '@/components/mode-toggle'
//import { LanguageSelector } from '@/components/language-selector'

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import {
  ListItem,
} from '@/components/ui/navigation-list-item'

export function NavigationMenuMore() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>More</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 w-[13.5rem] md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <LogoIcon className="h-12 w-12" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Pixelify
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Block distractive images on websites to focus and get more work done.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/help" title="Help">
                Learn how to use Pixelify to its fullest effect.
              </ListItem>
              <ListItem href="/blog" title="Blog">
                Get insights into future of Pixelify.
              </ListItem>
              <ListItem href="/changelog" title="Changelog">
                Explore latest changes and stay on top of updates.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}


export function Header() {
  return (
    <div className="container mx-auto md:px-6 lg:px-8 border-b-4 flex justify-center">
      <header className="max-w-3xl flex h-20 w-full shrink-0 items-center px-2 md:px-6">
        <a href="/" className="flex items-center pr-2">
          <LogoIcon className="h-12 w-12" />
          <span className="text-xl">Pixelify</span>
        </a>
          <NavigationMenuMore />
        <div className="ml-auto flex gap-4 items-center">

          <ModeToggle/>
        </div>
      </header>
    </div>
  )
}

function LogoIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="128"
      height="128"
      viewBox="0 0 128 128"
    >
<rect x="23.5" y="23.5" width="81" height="81" rx="6.5" stroke="currentColor" strokeWidth="3" fill="none"/>
<path d="M60.0625 68.1562H47.9062V63.25H60.0625C62.4167 63.25 64.3229 62.875 65.7812 62.125C67.2396 61.375 68.3021 60.3333 68.9688 59C69.6562 57.6667 70 56.1458 70 54.4375C70 52.875 69.6562 51.4062 68.9688 50.0312C68.3021 48.6562 67.2396 47.5521 65.7812 46.7188C64.3229 45.8646 62.4167 45.4375 60.0625 45.4375H49.3125V86H43.2812V40.5H60.0625C63.5 40.5 66.4062 41.0938 68.7812 42.2812C71.1562 43.4688 72.9583 45.1146 74.1875 47.2188C75.4167 49.3021 76.0312 51.6875 76.0312 54.375C76.0312 57.2917 75.4167 59.7812 74.1875 61.8438C72.9583 63.9062 71.1562 65.4792 68.7812 66.5625C66.4062 67.625 63.5 68.1562 60.0625 68.1562ZM86.5576 63.8105V86H81.123V63.8105H86.5576ZM80.7539 58.0068C80.7539 57.2002 81.0273 56.5303 81.5742 55.9971C82.1348 55.4639 82.8867 55.1973 83.8301 55.1973C84.7734 55.1973 85.5186 55.4639 86.0654 55.9971C86.626 56.5303 86.9062 57.2002 86.9062 58.0068C86.9062 58.7998 86.626 59.4629 86.0654 59.9961C85.5186 60.5293 84.7734 60.7959 83.8301 60.7959C82.8867 60.7959 82.1348 60.5293 81.5742 59.9961C81.0273 59.4629 80.7539 58.7998 80.7539 58.0068Z" fill="currentColor"/>
    </svg>
  )
}
