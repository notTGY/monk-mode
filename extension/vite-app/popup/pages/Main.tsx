import { Power, Earth, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  usePixelifyStatus,
} from '@/hooks/usePixelifyStatus'
import {
  useCurrentWebsite,
} from '@/hooks/useCurrentWebsite'
import {
  useWebsiteBlocklist,
} from '@/hooks/useWebsiteBlocklist'

import { useTranslation } from 'react-i18next'

const openSettings = () => {
  if (import.meta.env.DEV) {
    console.log('opening options page')
    return
  }
  chrome.runtime.openOptionsPage()
}

export default function Main() {
  const { t } = useTranslation('popup', {
    keyPrefix: 'main'
  })
  const [
    isLoadingWebsite, website,
  ] = useCurrentWebsite()

  const [
    isLoadingPixelifyStatus,
    isPixelifyActive,
    onToggle,
  ] = usePixelifyStatus(isLoadingWebsite, website)

  const [
    isLoadingBlocklist,
    isUrlBlocked,
    isHostnameBlocked,
    isRuleBlocked,
    urlAction,
    hostnameAction,
  ] = useWebsiteBlocklist(isLoadingWebsite, website)

  const toggleText = t(`toggle-pixelify.${
    isPixelifyActive ? 'action-off' : 'action-on'
  }`)

  const toggleDescription = t(`toggle-pixelify.description.${
    isRuleBlocked ? 'always-on' : 'always-off'
  }`)

  const urlActionText = t(`blocklist.${
    isUrlBlocked ? 'unblock-url' : 'block-url'
  }`)

  const hostnameActionText = t(`blocklist.${
    isHostnameBlocked ? 'unblock-hostname' : 'block-hostname'
  }`)

  return (
    <div className="bg-background min-h-screen w-full h-full p-4 flex flex-col items-center pt-8">
      {/* Header */}
      <div className="px-6 mb-2 flex items-center gap-2">
        <Button 
          className="w-full text-xl rounded-full" 
          onClick={onToggle}
          disabled={isLoadingWebsite && isLoadingPixelifyStatus}
          variant={isPixelifyActive ? 'default' : 'outline'}
          data-testid="pix"
        >
          <Power className="w-8 h-8" strokeWidth={3} /> {toggleText}
        </Button>
      </div>
      <p className="text-center mb-8 text-xs max-w-48">
        {toggleDescription}
      </p>

      {/* Main Card */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">
            {t('blocklist.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoadingWebsite ? (
            // Loading State
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[160px]" />
                </div>
              </div>
            </div>
          ) : website ? (
            // Loaded State
            <div className="flex items-center gap-2 overflow-hidden">
              {
                website.icon ? (
                  <img 
                    src={website.icon} 
                    alt={`${website.title} icon`}
                    className="w-10 h-10"
                  />
                ) : (
                  <Earth className="w-10 h-10 shrink-0" />
                )
              }
              <div className="space-y-1 max-w-[calc(100%-3rem)]">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="text-nowrap overflow-hidden text-ellipsis text-lg font-medium">
                        {website.title}
                      </h3>
                    </TooltipTrigger>
                    <TooltipContent align="start">
                      <p className="max-w-[calc(100vw-2rem)] break-all">{website.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-nowrap overflow-hidden text-ellipsis text-sm text-muted-foreground">
                        {website.url}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent align="start">
                      <p className="max-w-[calc(100vw-2rem)] break-all">{website.url}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={urlAction}
                disabled={isLoadingBlocklist}
              >
                {urlActionText}
              </Button>
              {isLoadingBlocklist ? (
                <Info/>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info/>
                    </TooltipTrigger>
                    <TooltipContent align="start">
                      <p className="max-w-[calc(100vw-2rem)] break-all">
                        {t('blocklist.about-url')}
                        {' '}
                        {website?.url || ''}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={hostnameAction}
                disabled={isLoadingBlocklist}
              >
                {hostnameActionText}
              </Button>
              {isLoadingBlocklist ? (
                <Info/>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info/>
                    </TooltipTrigger>
                    <TooltipContent align="start">
                      <p className="max-w-[calc(100vw-2rem)] break-all">
                        {t('blocklist.about-hostname')}
                        {' '}
                        {new URL(website?.url || '').hostname}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
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
              {t('blocklist.deeplink')}
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
