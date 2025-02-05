import { clsx } from 'clsx'
import { Settings, Redo, ChevronRight, ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Info } from 'lucide-react'

import { LanguageDrawer } from '@/components/language-toggle'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import { useSchedule } from '@/hooks/useSchedule'
import { useFilter } from '@/hooks/useFilter'
import { IMAGES } from '@/lib/filter'

import og from '@/assets/original.webp'

const openSettings = () => {
  if (import.meta.env.DEV) {
    console.log('opening options page')
    return
  }
  chrome.runtime.openOptionsPage()
}

export default function SettingsComponent() {
  const { t } = useTranslation('popup', {
    keyPrefix: 'settings',
  })

  const [
    isLoading,
    is9to5,
    on9to5Change,
  ] = useSchedule()

  const [
    next,
    prev,
    isLoadingFilter,
    selectedFilter,
  ] = useFilter()

  const image = isLoadingFilter ? og : IMAGES[selectedFilter]

  return (
    <div className="bg-background min-h-screen w-full h-full p-4 flex flex-col items-center pt-8">
      <div className="flex justify-center items-center gap-2">
        <div className="flex flex-col items-center gap-1">
          <img src={og} className="size-20 rounded-lg"/>
          <span>{t('filter.original')}</span>
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
                {t(`filter.loading`)}
              </span>
            ) : (
              <span
                className="font-bold cursor-pointer"
                onClick={next}
              >
                {t(`filter.${selectedFilter}`)}
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
      <Card className="w-full max-w-md mt-4 mb-2">
        <CardHeader>
          <CardTitle className="flex flex-row items-center text-xl gap-2">
            <Settings className="mb-[-4px]"/>
            {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Switch
                id="9-5"
                checked={is9to5}
                onCheckedChange={on9to5Change}
                disabled={isLoading}
              />
              <Label htmlFor="9-5">
                {t('9-5.title')}
              </Label>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info/>
                </TooltipTrigger>
                <TooltipContent align="start">
                  <p className="max-w-[calc(100vw-2rem)]">{t('9-5.about')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="pt-4 text-center">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                openSettings()
              }}
              className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
            >
              {t('more')}
            </a>
          </div>

        </CardContent>
      </Card>


      <LanguageDrawer/>

    </div>
  )
}
