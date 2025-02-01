import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function Event({
  idx,
  range,
  onChange,
}: {
  idx: number,
  range: string,
  onChange: (range: string) => void,
}) {
  const { t } = useTranslation('options', {
    keyPrefix: 'schedule.range',
  })
  const [startStr, endStr] = range.split('-')
  return (
    <div className="w-content flex gap-1">
      <div className="flex flex-col items-start justify-center gap-1">
        <Label htmlFor={`tstart-${idx}`}>
          {t('start')}
        </Label>
        <Input
          id={`tstart-${idx}`}
          type="time"
          value={startStr}
          max={endStr}
          data-testid="event-start"
          onChange={(e) => {
            onChange(`${e.target.value}-${endStr}`)
          }}
        />
      </div>
      <div className="flex flex-col items-end justify-center gap-1">
        <Label htmlFor={`tend-${idx}`}>
          {t('end')}
        </Label>
        <Input
          id={`tend-${idx}`}
          type="time"
          value={endStr}
          min={startStr}
          data-testid="event-end"
          onChange={(e) => {
            onChange(`${startStr}-${e.target.value}`)
          }}
        />
      </div>
    </div>
  )
}
