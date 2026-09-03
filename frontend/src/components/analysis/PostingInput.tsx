import SourceSelector from './SourceSelector'
import type { SourceType } from '../../types/api'

interface PostingInputProps {
  sourceType: SourceType
  text: string
  onSourceChange: (sourceType: SourceType) => void
  onTextChange: (text: string) => void
  heading?: string
  showSelector?: boolean
}

function PostingInput({ sourceType, text, onSourceChange, onTextChange, heading = 'Posting content', showSelector = true }: PostingInputProps) {
  return (
    <div className="posting-input">
      {showSelector ? <SourceSelector value={sourceType} onChange={onSourceChange} /> : null}
      <label className="form-field posting-input__field">
        <span className="form-field__label">{heading}</span>
        <textarea
          className="form-field__control form-field__control--textarea"
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder="Paste the job title, company details, and hiring message..."
          aria-label={heading}
        />
      </label>
    </div>
  )
}

export default PostingInput
