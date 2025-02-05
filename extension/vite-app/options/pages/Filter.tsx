import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import { Redo, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFilter } from '@/hooks/useFilter'
import { IMAGES } from '@/lib/filter'

import og from '@/assets/original.webp'

export default function Filter() {
  const { t } = useTranslation('options', {
    keyPrefix: 'filter',
  })

  const [
    next,
    prev,
    isLoadingFilter,
    selectedFilter,
  ] = useFilter()

  const image = isLoadingFilter ? og : IMAGES[selectedFilter]

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">
        {t('title')}
      </h1>

      <div className="flex justify-center items-center gap-2">
        <div className="flex flex-col items-center gap-1">
          <img src={og} className="size-20 rounded-lg"/>
          <span>{t('original')}</span>
        </div>
        <Redo className="size-8 -scale-y-100"/>
        <div className="w-40 flex flex-col items-center gap-1">
          <img
            src={image}
            className={clsx("size-32 rounded-lg", {
              "cursor-pointer": !isLoadingFilter,
            })}
            onClick={next}
          />
          <div className="flex items-center gap-2 w-full justify-between">
            <Button
              size="icon"
              variant="outline"
              onClick={prev}
              disabled={isLoadingFilter}
              className="size-6 rounded-full"
            >
              <ChevronLeft/>
            </Button>
            {isLoadingFilter ? (
              <span
                className="text-muted-foreground"
              >
                {t(`loading`)}
              </span>
            ) : (
              <span
                className="font-bold cursor-pointer"
                onClick={next}
              >
                {t(selectedFilter)}
              </span>
            )}
            <Button
              size="icon"
              variant="outline"
              onClick={next}
              disabled={isLoadingFilter}
              className="size-6 rounded-full"
            >
              <ChevronRight/>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
