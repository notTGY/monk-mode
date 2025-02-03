import React, { useState } from "react"
import { clsx } from "clsx"
import { useTranslation } from 'react-i18next'

import { ModeToggle } from '@/components/mode-toggle'
import { LanguageSwitch } from '@/components/language-toggle'
import { LogoIcon } from '@/components/logo-icon'
import {
  pages, page_to_component,
} from './pages'

const VERSION = "Beta 2/4/2025"

export default function App() {
  const { t } = useTranslation('options')
  const initialPage = 0
  const [page, setPage] = useState(initialPage)

  const children = React.createElement(
    page_to_component[pages[page]],
    {},
    null,
  )

  return (
    <div className="min-h-screen flex flex-col">
      {/* Left sidebar */}
      <header className="h-16 border-b flex items-center justify-between px-6">
        <div className="flex items-center">
          <LogoIcon className="h-12 w-12" />
          <h1 className="text-lg">
            {t('title')}
          </h1>
        </div>
        <div className="flex gap-2">
          <LanguageSwitch/>
          <ModeToggle/>
        </div>
      </header>
      {/* Main content */}
      <div className="flex-1 flex">
        <div className="w-64 flex flex-col justify-between">
          <nav className="p-4 space-y-2">
            {pages.map((pageId) => (
              <a
                href="#"
                data-testid={pageId}
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
                {t(`${pageId}.title`)}
              </a>
            ))}
          </nav>

          <footer className="text-xs p-6">
            {VERSION}
          </footer>
        </div>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
