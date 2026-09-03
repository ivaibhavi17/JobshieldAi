import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { DashboardData } from '../../types/api'

interface IndicatorChartProps {
  data: DashboardData['commonIndicators']
}

const colors = ['var(--color-rust)', 'var(--color-high)', 'var(--color-moderate)', 'var(--color-editorial-blue)']

function IndicatorChart({ data }: IndicatorChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 2, bottom: 0 }}>
        <CartesianGrid stroke="var(--color-rule)" strokeDasharray="2 4" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fill: 'var(--color-ink-soft)', fontSize: 10 }} tickLine={{ stroke: 'var(--color-rule)' }} axisLine={{ stroke: 'var(--color-rule)' }} />
        <YAxis type="category" dataKey="label" width={118} tick={{ fill: 'var(--color-ink)', fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ borderRadius: 0, borderColor: 'var(--color-rule)', background: 'var(--color-source)', color: 'var(--color-ink)', fontSize: 12 }} />
        <Bar dataKey="count" name="Indicators" barSize={13}>
          {data.map((item, index) => <Cell key={item.label} fill={colors[index % colors.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default IndicatorChart
