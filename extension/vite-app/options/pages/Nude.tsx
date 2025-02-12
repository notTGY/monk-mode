import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

import { useNude } from '@/hooks/useNude'

export default function Nude() {
  const { t } = useTranslation('options', {
    keyPrefix: 'nude',
  })

  const [
    isLoadingNude,
    isNude,
    toggleNude,
  ] = useNude()

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">
        {t('title')}
      </h1>

      <div className="flex items-center space-x-4 pt-6">
        <Switch
          id="nude-detection"
          checked={isNude}
          onCheckedChange={toggleNude}
          disabled={isLoadingNude}
        />
        <Label htmlFor="nude-detection">
          {t('action')}
        </Label>
      </div>
      <p className="max-w-96 text-base">{t('about')}</p>
    </div>
  )
}
