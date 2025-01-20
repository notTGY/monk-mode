import React, { useState } from "react"
import { clsx } from "clsx"

import { ModeToggle } from '@/components/mode-toggle'
import { LogoIcon } from '@/components/logo-icon'
import {
  pages, page_to_component, page_to_title,
} from '@/pages'

export default function App() {
  const initialPage = 0
  const [page, setPage] = useState(initialPage)

  const children = React.createElement(
    page_to_component[pages[page]],
    {},
    null,
  )

  return (
    <div className="min-h-screen flex">
      {/* Left sidebar */}
      <div className="w-64 border-r bg-background">
        <nav className="p-4 space-y-2">
          {pages.map((pageId) => (
            <a
              href="#"
              className={clsx(
                "text-lg block p-2 rounded-lg", {
                "bg-accent text-accent-foreground": pages[page] == pageId,
                "text-muted-foreground hover:bg-accent hover:text-accent-foreground": pages[page] != pageId,
              })}
              key={pageId}
              onClick={(e) => {
                e.preventDefault()
                setPage(pages.indexOf(pageId))
              }}
            >
              {page_to_title[pageId]}
            </a>
          ))}
        </nav>
      </div>
      {/* Main content */}
      <div className="flex-1">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <div className="flex items-center">
            <LogoIcon className="h-12 w-12" />
            <h1 className="text-lg">Pixelify options</h1>
          </div>
          <ModeToggle/>
        </header>

        <main className="p-6">{children}</main>

      </div>
    </div>
  )
}
