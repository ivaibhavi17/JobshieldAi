import type { SourceType } from '../../types/api'

interface SourceSelectorProps {
  value: SourceType
  onChange: (sourceType: SourceType) => void
  ariaLabel?: string
}

const sourceOptions: Array<{ value: SourceType; label: string }> = [
  { value: 'paste', label: 'Paste text' },
  { value: 'image', label: 'Image' },
  { value: 'document', label: 'PDF / TXT' },
]

function SourceSelector({ value, onChange, ariaLabel = 'Input source' }: SourceSelectorProps) {
  return (
    <div className="source-selector" role="group" aria-label={ariaLabel}>
      {sourceOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          className="source-selector__button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default SourceSelector
