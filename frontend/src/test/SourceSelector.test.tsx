import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import SourceSelector from '../components/analysis/SourceSelector'
import type { SourceType } from '../types/api'

function TestSelector() {
  const [source, setSource] = useState<SourceType>('paste')
  return <SourceSelector value={source} onChange={setSource} />
}

describe('SourceSelector', () => {
  it('switches between the supported source modes', async () => {
    const user = userEvent.setup()
    render(<TestSelector />)

    expect(screen.getByRole('button', { name: 'Paste text' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'Image' }))
    expect(screen.getByRole('button', { name: 'Image' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Paste text' })).toHaveAttribute('aria-pressed', 'false')
  })
})
