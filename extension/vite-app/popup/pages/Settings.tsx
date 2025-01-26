import { Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { LanguageDrawer } from '@/components/language-toggle'
import { Button } from '@/components/ui/button'

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
  return (
    <div className="bg-background min-h-screen w-full h-full p-4 flex flex-col items-center pt-8">
      {/* Header */}
      <div className="px-6 mb-8 flex items-center gap-2">
        <Settings />
        {t('title')}
      </div>

      <LanguageDrawer/>

      <Button onClick={openSettings}>
        {t('more')}
      </Button>
    </div>
  )
}
