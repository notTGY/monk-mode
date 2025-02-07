import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { useFilter } from '@/hooks/useFilter'
import { IMAGES } from '@/lib/filter'

import og from '@/assets/original.webp'

export default function Filter() {
  const { t } = useTranslation('options', {
    keyPrefix: 'filter',
  })

  const [
    next,
    prev,
    isLoadingFilter,
    selectedFilter,
    val,
  ] = useFilter()

  const Filters = Object.keys(IMAGES).map((filter: string) => {
    const id = `filter-${filter}`
    return (
      <div key={id} className={clsx(
        "flex items-start justify-between p-2 rounded border",
        {
          'border-primary': filter == selectedFilter,
          'border-transparent': filter != selectedFilter,
        }
      )}>
        <div className="flex items-center gap-2">
          <RadioGroupItem
            value={filter}
            id={id}
          />
          <Label htmlFor={id} className="cursor-pointer">
            <h2 className="text-lg">{t(filter)}</h2>
            <p className="text-muted-foreground max-w-64 font-normal">{t(`about.${filter}`)}</p>
          </Label>
        </div>
        <img
          src={IMAGES[filter]}
          className="size-32"
        />
      </div>
    )
  })

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">
        {t('title')}
      </h1>
      <RadioGroup
        value={selectedFilter}
        onValueChange={val}
        disabled={isLoadingFilter}
        data-testid="filter-group"
      >
        {Filters}
      </RadioGroup>
    </div>
  )
}
