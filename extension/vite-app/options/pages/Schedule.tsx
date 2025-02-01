import { useTranslation } from 'react-i18next'
import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useSchedule } from '@/hooks/useSchedule'
import { Calendar } from '@/components/calendar'


export default function Schedule() {
  const { t } = useTranslation('options', {
    keyPrefix: 'schedule',
  })
  
  const [
    isLoading,
    is9to5,
    on9to5Change,
    isRange,
    onIsRangeChange,
    ranges,
    onRangesChange,
  ] = useSchedule()


  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">
        {t('title')}
      </h1>

      <div className="flex items-center space-x-8 pt-6">
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
            <TooltipContent>
              <p className="max-w-prose">{t('9-5.about')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <h2 className="text-2xl font-bold pt-6">
        {t('range.title')}
      </h2>

      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <Switch
            data-testid="range-mode"
            id="range"
            checked={isRange}
            onCheckedChange={onIsRangeChange}
            disabled={isLoading}
          />
          <Label htmlFor="range">
            {t('range.action')}
          </Label>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info/>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-prose">{t('range.about')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {isLoading ? null : (
      <Calendar
        disabled={!isRange || isLoading}
        ranges={ranges}
        onRangesChange={onRangesChange}
      />
      )}
    </div>
  )
}
