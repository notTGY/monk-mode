/**
 * v0 by Vercel.
 * @see https://v0.dev/t/8YMiVEiEQXe
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { useState, useEffect } from 'react'
import { Check, X, ChevronDown } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"
import { useTranslation, languages } from "@/i18n/utils";
import { getRelativeLocaleUrl } from 'astro:i18n'

type TLang = 'en' | 'ru'


function Icon({
  lang,
  ...props
}: {
  lang: TLang,
  className?: string,
}) {
  if (lang == 'ru') {
    return <RuIcon {...props}/>
  }
  return <GbIcon {...props}/>
}

const getPath = () => {
  const path = typeof location == 'undefined' ? '.' : location.pathname
  const [_, lang, ...etc] = path.split('/')
  if (lang in languages) {
    return etc.join('/')
  }
  return path
}

export function LanguageToggle({
  lang,
}: {lang: string}) {
  const [path, setPath] = useState('.')
  useEffect(() => {
    setPath(getPath())
  }, [])
  return (
    <>
      <div className="hidden sm:block">
        <LanguageSwitch path={path} lang={lang}/>
      </div>
      <div className="sm:hidden">
        <LanguageDrawer path={path} lang={lang}/>
      </div>
    </>
  )
}

function LanguageSwitch({
  lang,
  path,
}: {lang: string, path: string}) {
  const { t } = useTranslation(lang)
  const languagesAvailable: TLang[]  = Object.keys(languages)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group" asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
        >
          <Icon lang={lang} />
          <span>{lang}</span>
          <ChevronDown
            className="relative top-[1px] ml-1 h-4 w-4 transition duration-300 group-data-[state=open]:rotate-180"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languagesAvailable.map((l) => (
          <DropdownMenuItem
            key={l}
            className="flex items-center justify-between"
            asChild
          >
            <a
              href={getRelativeLocaleUrl(l, path)}
            >
              <span className="flex gap-2">
                <Icon lang={l} className="h-5 w-5" />
                {t(`lang.${l}`)}
              </span>
              {l == lang
                ? <Check className="h-5 w-5" />
                : null
              }
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
function LanguageDrawer({
  lang,
  path,
}: {lang: string, path: string}) {
  const { t } = useTranslation(lang);
  const languagesAvailable: TLang[] =  Object.keys(languages)

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Icon lang={lang} />
          <span>{lang}</span>
          <ChevronDown
            className="h-4 w-4"
          />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle />
        <DrawerDescription className="flex items-center justify-between px-4">
          <span className="text-foreground text-lg font-medium">
            {t('lang.title')}
          </span>
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              autoFocus
            >
              <X className="h-5 w-5" />
            </Button>
          </DrawerClose>
        </DrawerDescription>
        <div className="grid gap-4 p-4">
          <div className="grid gap-2">
            {languagesAvailable.map((l) => (
              <Button
                variant="ghost"
                className="justify-start gap-2"
                asChild
                key={l}
              >
                <a
                  href={getRelativeLocaleUrl(l, path)}
                >
                    <Icon
                      lang={l}
                      className="h-5 w-5"
                    />
                    <span>{t(`lang.${l}`)}</span>
                    {l == lang
                      ? <Check className="h-5 w-5 ml-auto" />
                      : null
                    }
                </a>
              </Button>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function RuIcon(props: {className?: string}) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="18"
      viewBox="0 0 640 480"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path fill="#fff" d="M0 0h640v160H0z"/>
      <path fill="#0039a6" d="M0 160h640v160H0z"/>
      <path fill="#d52b1e" d="M0 320h640v160H0z"/>
    </svg>
  )
}

function GbIcon(props: {className?: string}) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="18"
      viewBox="0 0 640 480"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path fill="#012169" d="M0 0h640v480H0z"/>
      <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z"/>
      <path fill="#C8102E" d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z"/>
      <path fill="#FFF" d="M241 0v480h160V0zM0 160v160h640V160z"/>
      <path fill="#C8102E" d="M0 193v96h640v-96zM273 0v480h96V0z"/>
    </svg>
  )
}

