import { X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { useTranslation } from 'react-i18next'

interface BlocklistItemProps {
  value: string
  onRemove: (value: string) => void
}

export function BlocklistItem({ value, onRemove }: BlocklistItemProps) {
  const { t } = useTranslation()

  const desc = t('blocklist.dialog.description')

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
      <span className="flex-1 text-sm truncate">
        {value}
      </span>
      <AlertDialog>
        <AlertDialogTrigger>
          <X className="h-4 w-4" />
          <span className="sr-only">
            {t('blocklist.dialog.remove')} {value}
          </span>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('blocklist.dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {desc.substring(0, desc.indexOf('$'))}
              <strong className="font-bold text-primary"> {value} </strong>
              {desc.substring(desc.indexOf('$')+1)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('blocklist.dialog.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onRemove(value)}
              variant="destructive"
            >
              {t('blocklist.dialog.continue')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

