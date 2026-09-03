import { useRef, useState } from 'react'
import type { DragEvent, ChangeEvent } from 'react'
import Icon from '../ui/Icon'
import type { SourceType } from '../../types/api'

const MAX_FILE_BYTES = 8 * 1024 * 1024
const imageExtensions = ['jpg', 'jpeg', 'png']
const documentExtensions = ['pdf', 'txt']

interface UploadDropzoneProps {
  sourceType: Extract<SourceType, 'image' | 'document'>
  file: File | null
  status: 'idle' | 'uploading' | 'extracting' | 'ready' | 'error'
  error: string | null
  onFile: (file: File) => void
  onClear: () => void
}

function UploadDropzone({ sourceType, file, status, error, onFile, onClear }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const acceptedExtensions = sourceType === 'image' ? imageExtensions : documentExtensions
  const accept = sourceType === 'image' ? '.jpg,.jpeg,.png,image/jpeg,image/png' : '.pdf,.txt,application/pdf,text/plain'

  function validateFile(candidate: File) {
    const extension = candidate.name.split('.').pop()?.toLowerCase() ?? ''
    if (!acceptedExtensions.includes(extension)) {
      setLocalError(`Unsupported file type. Use ${acceptedExtensions.join(', ').toUpperCase()}.`)
      onClear()
      return
    }
    if (candidate.size > MAX_FILE_BYTES) {
      setLocalError('This file is larger than the 8 MB limit. Choose a smaller file or paste the text manually.')
      onClear()
      return
    }
    setLocalError(null)
    onFile(candidate)
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    const candidate = event.target.files?.[0]
    if (candidate) validateFile(candidate)
    event.target.value = ''
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)
    const candidate = event.dataTransfer.files[0]
    if (candidate) validateFile(candidate)
  }

  if (file) {
    return (
      <div className="upload-file-row" aria-live="polite">
        <div className="upload-file-row__meta">
          <span className="upload-file-row__name">{file.name}</span>
          <span className="upload-file-row__type">{status === 'extracting' ? 'Extracting text…' : status === 'ready' ? 'Ready to review' : 'Uploading…'}</span>
        </div>
        <button className="icon-button" type="button" onClick={onClear} aria-label={`Remove ${file.name}`} title="Remove file">
          <Icon name="x" size={18} />
        </button>
      </div>
    )
  }

  return (
    <div
      className={`upload-target${dragging ? ' upload-target--dragging' : ''}`}
      onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <Icon name="cloud-upload" size={28} className="upload-target__icon" />
      <h4 className="upload-target__title">Upload a posting</h4>
      <p className="upload-target__copy">Drop a {sourceType === 'image' ? 'JPG, JPEG, or PNG image' : 'PDF or TXT file'} here, or browse your device.</p>
      <button className="upload-target__browse" type="button" onClick={() => inputRef.current?.click()}>Browse files</button>
      <input ref={inputRef} className="sr-only" type="file" accept={accept} onChange={handleInput} aria-label={`Choose ${sourceType} file`} />
      {localError ? <p className="upload-target__error" role="alert">{localError}</p> : null}
      <span className="sr-only" role="status">{status === 'error' ? error : status === 'extracting' ? 'Extracting text' : localError ?? ''}</span>
    </div>
  )
}

export default UploadDropzone
