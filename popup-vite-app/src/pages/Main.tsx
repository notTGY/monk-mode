import { useState, useEffect } from 'react'
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


export interface Website {
  icon: string;
  title: string;
  url: string;
}

export interface WebsiteBlockerProps {
  onBlockPage?: () => void;
  onBlockWebsite?: () => void;
}

const mockWebsiteInfo: Website = {
  icon: "",
  title: "Saved Messages",
  url: "https://web.telegram.org/a/#-1002499894779_3662fds;fjd;sjf;dsjfdskjfdsjf;dsjf;ldksjfdskfj;saj",
}

const fetchWebsiteInfo = async (): Promise<Website> => {
  return new Promise((resolve, reject) => {
    if (typeof chrome.tabs == 'undefined') {
      if (import.meta.env.DEV) {
        resolve(mockWebsiteInfo)
        return
      }
      reject(new Error('Not running in chrome extension'))
      return
    }
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      if (tabs.length > 0) {
        const tab = tabs[0];
        resolve({
          icon: tab.favIconUrl || '', // The favicon URL of the page
          title: tab.title || '',     // The title of the page
          url: tab.url || '',         // The URL of the page
        });
      } else {
        reject(new Error('No active tab found'));
      }
    });
  });
};


const togglePixelation = async () => {
  const message = { action: 'toggle' }

  if (typeof chrome.tabs == 'undefined') {
    if (import.meta.env.DEV) {
      console.log('Sending to script', message)
      return
    }
    throw new Error('Not running in chrome extension')
    return
  }
  const tabs = await chrome.tabs.query({})

  for (const tab of tabs) {
    if (!tab.id) {
      continue
    }
    chrome.tabs.sendMessage(tab.id, message)
  }
}

export default function Main({ 
  onBlockPage,
  onBlockWebsite 
}: WebsiteBlockerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [website, setWebsite] = useState<Website>()
  
  useEffect(() => {
    const loadWebsiteInfo = async () => {
      const data = await fetchWebsiteInfo()
      setWebsite(data)
      setIsLoading(false)
    }
    loadWebsiteInfo()
  }, [])

  return (
    <div>
      {/* Header */}
      <div className="px-6 mb-8 flex items-center gap-2">
        <Button 
          className="w-full text-xl rounded-full" 
          onClick={togglePixelation}
          disabled={isLoading}
        >
          <Power className="w-8 h-8" strokeWidth={3} /> Turn Off Pixelate
        </Button>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Current website</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
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
                onClick={onBlockPage}
                disabled={isLoading}
              >
                Block only this page
              </Button>
              {isLoading ? (
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
                onClick={onBlockWebsite}
                disabled={isLoading}
              >
                Block entire website
              </Button>
              {isLoading ? (
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
