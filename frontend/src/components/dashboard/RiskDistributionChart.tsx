import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { DashboardData, RiskLevel } from '../../types/api'

interface RiskDistributionChartProps {
  data: DashboardData['riskDistribution']
}

const colors: Record<RiskLevel, string> = {
  LOW: 'var(--color-low)',
  MODERATE: 'var(--color-moderate)',
  HIGH: 'var(--color-high)',
  'VERY HIGH': 'var(--color-very-high)',
}

function RiskDistributionChart({ data }: RiskDistributionChartProps) {
  const chartData = data.map((item) => ({ ...item, label: item.level === 'VERY HIGH' ? 'Very High' : item.level.charAt(0) + item.level.slice(1).toLowerCase() }))
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 16, left: 2, bottom: 0 }}>
        <CartesianGrid stroke="var(--color-rule)" strokeDasharray="2 4" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fill: 'var(--color-ink-soft)', fontSize: 10 }} tickLine={{ stroke: 'var(--color-rule)' }} axisLine={{ stroke: 'var(--color-rule)' }} />
        <YAxis type="category" dataKey="label" width={62} tick={{ fill: 'var(--color-ink)', fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ borderRadius: 0, borderColor: 'var(--color-rule)', background: 'var(--color-source)', color: 'var(--color-ink)', fontSize: 12 }} />
        <Bar dataKey="count" name="Jobs" barSize={12} radius={0}>
          {chartData.map((item) => <Cell key={item.level} fill={colors[item.level]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default RiskDistributionChart
