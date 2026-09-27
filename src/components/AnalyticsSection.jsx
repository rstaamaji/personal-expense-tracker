import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'
import { formatRupiah, formatCompactRupiah } from '../utils/formatters'
import './AnalyticsSection.css'

/**
 * Custom Tooltip for Recharts — dark glass style.
 */
function CustomRupiahTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(10,15,28,0.92)',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: '12px',
        padding: '0.6rem 0.875rem',
        boxShadow: '0 0 24px rgba(139,92,246,0.15)',
        fontSize: '0.8rem',
      }}>
        {label && (
          <div style={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.7rem' }}>
            {label}
          </div>
        )}
        {payload.map((entry, index) => (
          <div key={`tip-${index}`} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-main)', marginTop: '0.2rem' }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: entry.color || entry.fill, flexShrink: 0 }} />
            <span style={{ color: 'var(--text-muted)' }}>{entry.name}:</span>
            <strong>{formatRupiah(entry.value)}</strong>
          </div>
        ))}
      </div>
    )
  }
  return null
}

/**
 * Custom Tooltip for Category Pie Charts.
 */
function CustomPieTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div style={{
        background: 'rgba(10,15,28,0.92)',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: '12px',
        padding: '0.6rem 0.875rem',
        boxShadow: '0 0 24px rgba(139,92,246,0.15)',
        fontSize: '0.8rem',
      }}>
        <div style={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {data.category}
        </div>
        <div style={{ color: 'var(--text-main)' }}>{formatRupiah(data.amount)}</div>
        <div style={{ color: 'var(--text-subtle)', fontSize: '0.72rem' }}>{data.percentage}% of total</div>
      </div>
    )
  }
  return null
}

/**
 * Financial Analytics and Charts section.
 */
export default function AnalyticsSection({
  stats,
  expenseByCategory,
  incomeByCategory,
  incomeVsExpenseData,
  spendingTrendData,
}) {
  return (
    <section className="analytics-section" aria-label="Financial Analytics and Charts">
      {/* ==================================================
          Metric Cards Row
          ================================================== */}
      <div className="analytics-metrics-grid">
        <div className="analytics-metric-card">
          <div className="analytics-metric-label">Average Expense</div>
          <div className="analytics-metric-value">{formatRupiah(stats.averageExpense)}</div>
          <div className="analytics-metric-subtext">Per logged expense ({stats.expenseCount} txns)</div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-metric-label">Largest Expense</div>
          <div className="analytics-metric-value">{formatRupiah(stats.largestExpense)}</div>
          <div className="analytics-metric-subtext">Single highest expense</div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-metric-label">Largest Income</div>
          <div className="analytics-metric-value">{formatRupiah(stats.largestIncome)}</div>
          <div className="analytics-metric-subtext">Single highest earnings</div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-metric-label">Savings Rate</div>
          <div className={`analytics-metric-value ${stats.savingsRate >= 0 ? '' : ''}`}
            style={{ color: stats.savingsRate >= 0 ? 'var(--income)' : 'var(--expense)' }}
          >
            {stats.savingsRate}%
          </div>
          <div className="analytics-metric-subtext">
            {stats.savingsRate >= 0 ? 'Surplus retained' : 'Deficit spending'}
          </div>
        </div>
      </div>

      {/* ==================================================
          Charts Row 1: Income vs Expense + Spending Trend
          ================================================== */}
      <div className="analytics-charts-grid">
        {/* Income vs Expense Bar Chart */}
        <div className="analytics-chart-card">
          <div>
            <div className="analytics-chart-title">Income vs Expense</div>
            <div className="analytics-chart-subtitle">Monthly financial comparison</div>
          </div>
          <div style={{ height: 260 }}>
            {incomeVsExpenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeVsExpenseData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,140,180,0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-subtle)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-subtle)" fontSize={11} tickFormatter={formatCompactRupiah} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomRupiahTooltip />} cursor={{ fill: 'rgba(139,92,246,0.06)' }} />
                  <Legend wrapperStyle={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '8px' }} iconType="circle" />
                  <Bar dataKey="Income" fill="#22D3EE" radius={[4, 4, 0, 0]} maxBarSize={45} />
                  <Bar dataKey="Expense" fill="#F43F5E" radius={[4, 4, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="analytics-empty" style={{ height: '100%' }}>
                <div className="analytics-empty-icon">📊</div>
                <div className="analytics-empty-title">No data yet</div>
                <div className="analytics-empty-desc">Add transactions to see your financial comparison</div>
              </div>
            )}
          </div>
        </div>

        {/* Spending Trend Area Chart */}
        <div className="analytics-chart-card">
          <div>
            <div className="analytics-chart-title">Spending Trend</div>
            <div className="analytics-chart-subtitle">Expenses timeline over dates</div>
          </div>
          <div style={{ height: 260 }}>
            {spendingTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendingTrendData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cyanTrendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,140,180,0.1)" vertical={false} />
                  <XAxis dataKey="label" stroke="var(--text-subtle)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-subtle)" fontSize={11} tickFormatter={formatCompactRupiah} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomRupiahTooltip />} cursor={{ stroke: 'rgba(139,92,246,0.3)', strokeWidth: 1 }} />
                  <Area
                    type="monotone"
                    name="Expense"
                    dataKey="amount"
                    stroke="#8B5CF6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#cyanTrendGrad)"
                    dot={{ r: 3, fill: '#8B5CF6', strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#A855F7', stroke: 'rgba(139,92,246,0.4)', strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="analytics-empty" style={{ height: '100%' }}>
                <div className="analytics-empty-icon">📈</div>
                <div className="analytics-empty-title">No data yet</div>
                <div className="analytics-empty-desc">Log expenses to see your spending trend</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================
          Charts Row 2: Category Breakdowns
          ================================================== */}
      <div className="analytics-charts-grid">
        {/* Expense by Category */}
        <div className="analytics-chart-card">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div>
              <div className="analytics-chart-title">Expense by Category</div>
              <div className="analytics-chart-subtitle">Allocation across spending types</div>
            </div>
            <span className="badge badge-expense">{formatRupiah(stats.totalExpense)}</span>
          </div>

          {expenseByCategory.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1rem', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={expenseByCategory} dataKey="amount" nameKey="category" cx="50%" cy="50%" innerRadius={42} outerRadius={72} paddingAngle={4}>
                    {expenseByCategory.map((entry, index) => (
                      <Cell key={`exp-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="analytics-category-bars">
                {expenseByCategory.map((item) => (
                  <div key={item.category} className="category-bar-item">
                    <div className="category-bar-meta">
                      <span className="category-bar-name">
                        <span className="category-bar-dot" style={{ backgroundColor: item.color }} />
                        {item.category}
                      </span>
                      <span className="category-bar-pct">{item.percentage}%</span>
                    </div>
                    <div className="category-bar-track">
                      <div className="category-bar-fill" style={{ width: `${item.percentage}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="analytics-empty">
              <div className="analytics-empty-icon">🏷️</div>
              <div className="analytics-empty-title">No expense data</div>
              <div className="analytics-empty-desc">Log some expenses to see category breakdown</div>
            </div>
          )}
        </div>

        {/* Income by Category */}
        <div className="analytics-chart-card">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div>
              <div className="analytics-chart-title">Income by Category</div>
              <div className="analytics-chart-subtitle">Sources of earned funds</div>
            </div>
            <span className="badge badge-income">{formatRupiah(stats.totalIncome)}</span>
          </div>

          {incomeByCategory.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1rem', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={incomeByCategory} dataKey="amount" nameKey="category" cx="50%" cy="50%" innerRadius={42} outerRadius={72} paddingAngle={4}>
                    {incomeByCategory.map((entry, index) => (
                      <Cell key={`inc-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="analytics-category-bars">
                {incomeByCategory.map((item) => (
                  <div key={item.category} className="category-bar-item">
                    <div className="category-bar-meta">
                      <span className="category-bar-name">
                        <span className="category-bar-dot" style={{ backgroundColor: item.color }} />
                        {item.category}
                      </span>
                      <span className="category-bar-pct">{item.percentage}%</span>
                    </div>
                    <div className="category-bar-track">
                      <div className="category-bar-fill" style={{ width: `${item.percentage}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="analytics-empty">
              <div className="analytics-empty-icon">💰</div>
              <div className="analytics-empty-title">No income data</div>
              <div className="analytics-empty-desc">Log some income to see category breakdown</div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
