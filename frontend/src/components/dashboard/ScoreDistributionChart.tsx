import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { DashboardData } from '../../types/api'

interface ScoreDistributionChartProps {
  data: DashboardData['scoreDistribution']
}

function scoreColor(min: number) {
  if (min <= 30) return 'var(--color-low)'
  if (min <= 60) return 'var(--color-moderate)'
  if (min <= 80) return 'var(--color-high)'
  return 'var(--color-very-high)'
}

function ScoreDistributionChart({ data }: ScoreDistributionChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 12, right: 16, left: -18, bottom: 0 }}>
        <CartesianGrid stroke="var(--color-rule)" strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey="band" tick={{ fill: 'var(--color-ink-soft)', fontSize: 10 }} tickLine={{ stroke: 'var(--color-rule)' }} axisLine={{ stroke: 'var(--color-rule)' }} />
        <YAxis allowDecimals={false} tick={{ fill: 'var(--color-ink-soft)', fontSize: 10 }} tickLine={{ stroke: 'var(--color-rule)' }} axisLine={{ stroke: 'var(--color-rule)' }} />
        <Tooltip contentStyle={{ borderRadius: 0, borderColor: 'var(--color-rule)', background: 'var(--color-source)', color: 'var(--color-ink)', fontSize: 12 }} />
        <Bar dataKey="count" name="Jobs" barSize={26}>
          {data.map((item) => <Cell key={item.band} fill={scoreColor(item.min)} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default ScoreDistributionChart
