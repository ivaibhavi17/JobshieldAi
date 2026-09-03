import { Link, useLocation } from 'react-router-dom'

const items = [
  { number: '01', title: 'Start', to: '/' },
  { number: '02', title: 'Analyze a job', to: '/analyze' },
  { number: '03', title: 'Risk summary', to: '/analysis/demo' },
  { number: '04', title: 'Dashboard', to: '/dashboard' },
  { number: '05', title: 'Past analyses', to: '/history' },
  { number: '06', title: 'Model performance', to: '/model-performance' },
]

function PageIndex() {
  const location = useLocation()

  return (
    <aside className="page-index" aria-label="Page index">
      <div>
        <p className="page-index__title label-mono">Page index</p>
        <p className="page-index__description">A field guide to each product surface.</p>
      </div>
      <ol className="page-index__list">
        {items.map((item) => (
          <li key={item.number}>
            <Link className="page-index__link" to={item.to} aria-current={location.pathname === item.to ? 'page' : undefined}>
              <span className="page-index__number">{item.number}</span>
              <span className="page-index__link-title">{item.title}</span>
            </Link>
          </li>
        ))}
      </ol>
      <div className="page-index__state">
        <span className="label-mono">State</span>
        <p className="page-index__state-title">Demo Data</p>
        <p className="page-index__state-copy">Actual model confidence is unavailable.</p>
      </div>
    </aside>
  )
}

export default PageIndex
