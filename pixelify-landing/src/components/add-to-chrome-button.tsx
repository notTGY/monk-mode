import { Chrome } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from '@/i18n/utils'

export function CtaButton({
  lang,
}: {lang: string}) {
  const { t } = useTranslation(lang)

  return (
    <div className="flex gap-1">
      <a
        href={t('cws-link')}
        target="_blank"
        data-umami-event="cws-action"
      >
        <Button size="lg" className="text-lg py-6 px-3">
          <Chrome className="h-8 w-8" />
          {t('cws-action')}
        </Button>
      </a>
      <a
        href={t('amo-link')}
        target="_blank"
        data-umami-event="amo-action"
      >
        <Button size="lg" className="text-lg px-2 py-6">
          <Firefox className="h-8 w-8" />
          <span className="sr-only">{t('amo-action')}</span>
        </Button>
      </a>
    </div>
  )
}

function Firefox(props) {
  return (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    {...props}
  >
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
    <path d="M4.028 7.82a9 9 0 1 0 12.823-3.4C15.215 3.4 13.787 3.4 12 3.4h-1.647"/>
    <path d="M4.914 9.485c-1.756-1.569-.805-5.38.109-6.17c.086.896.585 1.208 1.111 1.685c.88-.275 1.313-.282 1.867 0c.82-.91 1.694-2.354 2.628-2.093C9.547 4.648 10.559 6.64 12 7.08c-.17.975-1.484 1.913-2.76 2.686c-1.296.938-.722 1.85 0 2.234c.949.506 3.611-1 4.545.354c-1.698.102-1.536 3.107-3.983 2.727c2.523.957 4.345.462 5.458-.34c1.965-1.52 2.879-3.542 2.879-5.557c-.014-1.398.194-2.695-1.26-4.75"/>
    </g>
  </svg>
  )
}
