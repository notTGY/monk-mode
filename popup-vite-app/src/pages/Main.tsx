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


export default function Main() {
  const [
    isLoadingPixelifyStatus,
    isPixelifyActive,
    onToggle,
  ] = usePixelifyStatus()

  const [
    isLoadingWebsite, website,
  ] = useCurrentWebsite()

  const [
    isLoadingBlocklist,
    isUrlBlocked,
    isHostnameBlocked,
    urlAction,
    hostnameAction,
  ] = useWebsiteBlocklist(isLoadingWebsite, website)

  
  const toggleText = isPixelifyActive ? (
    'Turn Off Pixelify'
  ) : (
    'Turn On Pixelify'
  )

  const toggleDescription = (isUrlBlocked || isHostnameBlocked) ? (
    'once you open new window, images will be hidden again'
  ) : (
    'once you open new window, images will be shown again'
  )

  const urlActionText = isUrlBlocked ? (
    'Unblock this page'
  ) : (
    'Block only this page'
  )

  const hostnameActionText = isHostnameBlocked ? (
    'Unblock entire website'
  ) : (
    'Block entire website'
  )


  return (
    <div className="bg-background min-h-screen w-full h-full p-4 flex flex-col items-center pt-8">
      {/* Header */}
      <div className="px-6 mb-2 flex items-center gap-2">
        <Button 
          className="w-full text-xl rounded-full" 
          onClick={onToggle}
          disabled={isLoadingPixelifyStatus}
          variant={isPixelifyActive ? 'default' : 'outline'}
        >
          <Power className="w-8 h-8" strokeWidth={3} /> {toggleText}
        </Button>
      </div>
      <p className="text-center mb-8 text-xs">
        {toggleDescription}
      </p>

      {/* Main Card */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Current website</CardTitle>
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
            <div className="flex items-center gap-3">
              {
                website.icon ? (
                  <img 
                    src={website.icon} 
                    alt={`${website.title} icon`}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <Earth className="w-10 h-10" />
                )
              }
              <div className="space-y-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="line-clamp-1 max-w-52 font-medium overflow-hidden text-ellipsis">
                        {website.title}
                      </h3>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{website.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="line-clamp-1 max-w-52 overflow-hidden text-ellipsis text-sm text-muted-foreground">
                        {website.url}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{website.url}</p>
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
                    <TooltipContent>
                      <p>Images will be blurred on {website?.url}</p>
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
                    <TooltipContent>
                      <p>Images will be blurred on {new URL(website?.url || '').hostname}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          <div className="pt-4 text-center">
            <a 
              href="#" 
              className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
            >
              Manage blocklist
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
