import { Settings } from 'lucide-react'
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

import { useSchedule } from '@/hooks/useSchedule'

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

  return (
    <div className="bg-background min-h-screen w-full h-full p-4 flex flex-col items-center pt-8">
      <Card className="w-full max-w-md mt-[6.75rem] mb-8">
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
