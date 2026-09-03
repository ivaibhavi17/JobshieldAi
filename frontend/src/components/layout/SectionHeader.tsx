interface SectionHeaderProps {
  kicker: string
  title: string
  description?: string
  rust?: boolean
}

function SectionHeader({ kicker, title, description, rust = false }: SectionHeaderProps) {
  return (
    <div className="page-section__heading">
      <div className="page-section__heading-copy">
        <p className={`section-kicker${rust ? ' section-kicker--rust' : ''}`}>{kicker}</p>
        <h2 className="page-section__title">{title}</h2>
      </div>
      {description ? <p className="page-section__description">{description}</p> : null}
    </div>
  )
}

export default SectionHeader
