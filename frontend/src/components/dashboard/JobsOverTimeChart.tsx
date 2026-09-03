import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { DashboardData } from '../../types/api'

interface JobsOverTimeChartProps {
  data: DashboardData['jobsOverTime']
}

function JobsOverTimeChart({ data }: JobsOverTimeChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid stroke="var(--color-rule)" strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: 'var(--color-ink-soft)', fontSize: 10 }} tickLine={{ stroke: 'var(--color-rule)' }} axisLine={{ stroke: 'var(--color-rule)' }} />
        <YAxis allowDecimals={false} tick={{ fill: 'var(--color-ink-soft)', fontSize: 10 }} tickLine={{ stroke: 'var(--color-rule)' }} axisLine={{ stroke: 'var(--color-rule)' }} />
        <Tooltip cursor={{ stroke: 'var(--color-editorial-blue)', strokeWidth: 1 }} contentStyle={{ borderRadius: 0, borderColor: 'var(--color-rule)', background: 'var(--color-source)', color: 'var(--color-ink)', fontSize: 12 }} />
        <Line type="linear" dataKey="count" name="Jobs analyzed" stroke="var(--color-editorial-blue)" strokeWidth={2.5} dot={{ fill: 'var(--color-editorial-blue)', r: 3 }} activeDot={{ r: 5, fill: 'var(--color-rust)' }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default JobsOverTimeChart
