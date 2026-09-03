import type { CSSProperties } from 'react'

interface IconProps {
  name: string
  label?: string
  size?: number
  color?: string
  className?: string
}

function Icon({ name, label, size = 18, color = 'currentColor', className = '' }: IconProps) {
  const style = { fontSize: size, color } as CSSProperties
  return <i className={`ti ti-${name} ${className}`} aria-hidden={label ? undefined : true} aria-label={label} role={label ? 'img' : undefined} style={style} />
}

export default Icon
