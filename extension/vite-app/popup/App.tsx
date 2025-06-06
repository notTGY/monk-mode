import './App.css'
import { createElement, useState } from 'react'
import { clsx } from 'clsx'
import { Settings } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  pages, page_to_component,
} from './pages'
import { useTranslation } from 'react-i18next'

import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'

export default function App() {
  const { t } = useTranslation('popup')
  const initialPage = 0
  const [page, setPage] = useState(initialPage)
  const [sliderRef, instanceRef] = useKeenSlider({
    slides: { spacing: 32 },
    initial: initialPage,
    animationEnded(o) {
      setPage(o.track.details.abs)
    }
  }, [])

  const navigate = (page: string) => {
    const index = pages.indexOf(page)
    if (index === -1) return

    if (instanceRef.current) {
      instanceRef.current.moveToIdx(
        index,
        true,
      )
      setPage(index)
    }
  }

  const bottomNav = (
    <div className={clsx(
      "fixed bottom-0 left-0 right-0 border-t bg-background p-4",
      {
        "max-w-[320px]": !import.meta.env.DEV,
      },
    )}>
      <div className="max-w-md mx-auto flex justify-between items-center">
      {pages.map((pageId, i) => (
        <Button
          key={pageId}
          variant={page == i ? "secondary" : "ghost"}
          onClick={() => navigate(pageId)}
          size="sm"
          data-testid={`${pageId}-button`}
        >
          {t(`${pageId}.title`)}
        {pageId === 'settings'
          ? <Settings/>
          : null
        }
        </Button>
      ))}
      </div>
    </div>
  )

  return (
    <div className="bg-background">
      <div
        className="keen-slider"
        ref={sliderRef}
      >
        {pages.map((pageId) => (
          <div className="keen-slider__slide" key={pageId}>
          {createElement(page_to_component[pageId], { navigate }, null)}
          </div>
        ))}
      </div>
      {pages.length > 1 ? bottomNav : null}
    </div>
  )
}
