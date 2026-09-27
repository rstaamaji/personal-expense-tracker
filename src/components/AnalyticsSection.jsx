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
 * Custom Tooltip for Recharts displaying formatted Indonesian Rupiah.
 */
function CustomRupiahTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        {label && <span className="tooltip-title">{label}</span>}
        {payload.map((entry, index) => (
          <div key={`tooltip-item-${index}`} className="tooltip-row">
            <span style={{ color: entry.color || entry.fill }}>
              <span
                className="tooltip-color-dot"
                style={{ backgroundColor: entry.color || entry.fill }}
              />
              {entry.name}:
            </span>
            <strong>{formatRupiah(entry.value)}</strong>
          </div>
        ))}
      </div>
    )
  }
  return null
}

/**
 * Custom Tooltip specifically for Category Pie Charts.
 */
function CustomPieTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="chart-tooltip">
        <span className="tooltip-title">{data.category}</span>
        <div className="tooltip-row">
          <span>Amount:</span>
          <strong>{formatRupiah(data.amount)}</strong>
        </div>
        <div className="tooltip-row">
          <span>Share:</span>
          <strong>{data.percentage}%</strong>
        </div>
      </div>
    )
  }
  return null
}

/**
 * Financial Analytics and Charts section (Day 4).
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
          Analytics Metric Cards (4 Cards)
          ================================================== */}
      <div className="analytics-metrics-grid">
        {/* Average Expense */}
        <div className="analytics-metric-card">
          <div className="metric-header">
            <span className="metric-label">Average Expense</span>
            <div className="metric-icon-box" aria-hidden="true">
              📊
            </div>
          </div>
          <div className="metric-value">{formatRupiah(stats.averageExpense)}</div>
          <div className="metric-footer">
            <span>Per logged expense ({stats.expenseCount} transactions)</span>
          </div>
        </div>

        {/* Largest Expense */}
        <div className="analytics-metric-card">
          <div className="metric-header">
            <span className="metric-label">Largest Expense</span>
            <div className="metric-icon-box" aria-hidden="true">
              🔥
            </div>
          </div>
          <div className="metric-value">{formatRupiah(stats.largestExpense)}</div>
          <div className="metric-footer">
            <span>Single highest expense</span>
          </div>
        </div>

        {/* Largest Income */}
        <div className="analytics-metric-card">
          <div className="metric-header">
            <span className="metric-label">Largest Income</span>
            <div className="metric-icon-box" aria-hidden="true">
              💎
            </div>
          </div>
          <div className="metric-value">{formatRupiah(stats.largestIncome)}</div>
          <div className="metric-footer">
            <span>Single highest earnings</span>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="analytics-metric-card">
          <div className="metric-header">
            <span className="metric-label">Savings Rate</span>
            <div className="metric-icon-box" aria-hidden="true">
              🎯
            </div>
          </div>
          <div className="metric-value">{stats.savingsRate}%</div>
          <div className="metric-footer">
            <span>
              {stats.savingsRate >= 0 ? 'Surplus retained' : 'Deficit spending'}
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================
          Charts Grid: Row 1 (Income vs Expense & Spending Trend)
          ================================================== */}
      <div className="charts-grid">
        {/* Chart 1: Income vs Expense Comparison */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title-wrap">
              <h3 className="chart-title">Income vs Expense</h3>
              <span className="chart-subtitle">Monthly financial comparison</span>
            </div>
          </div>

          <div className="chart-body">
            {incomeVsExpenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeVsExpenseData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--border-subtle)' }}
                  />
                  <YAxis
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickFormatter={formatCompactRupiah}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--border-subtle)' }}
                  />
                  <Tooltip content={<CustomRupiahTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: '0.8rem', paddingTop: '10px' }}
                    iconType="circle"
                  />
                  <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={45} />
                  <Bar dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty-state">
                <span className="chart-empty-icon">📊</span>
                <span className="chart-empty-text">No transaction data available yet</span>
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Spending Trend */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title-wrap">
              <h3 className="chart-title">Spending Trend</h3>
              <span className="chart-subtitle">Expenses timeline over dates</span>
            </div>
          </div>

          <div className="chart-body">
            {spendingTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendingTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="purpleTrendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--border-subtle)' }}
                  />
                  <YAxis
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickFormatter={formatCompactRupiah}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--border-subtle)' }}
                  />
                  <Tooltip content={<CustomRupiahTooltip />} />
                  <Area
                    type="monotone"
                    name="Expense"
                    dataKey="amount"
                    stroke="#7c3aed"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#purpleTrendGrad)"
                    dot={{ r: 3, fill: '#7c3aed', strokeWidth: 1 }}
                    activeDot={{ r: 5, fill: '#9d72ff', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty-state">
                <span className="chart-empty-icon">📈</span>
                <span className="chart-empty-text">No expense records logged yet</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================
          Charts Grid: Row 2 (Expense Breakdown & Income Breakdown)
          ================================================== */}
      <div className="charts-grid">
        {/* Chart 3: Expense by Category */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title-wrap">
              <h3 className="chart-title">Expense by Category</h3>
              <span className="chart-subtitle">Allocation across spending types</span>
            </div>
            <span className="badge badge-expense">
              {formatRupiah(stats.totalExpense)}
            </span>
          </div>

          <div className="chart-body" style={{ display: 'grid', gridTemplateColumns: expenseByCategory.length > 0 ? '1.1fr 1fr' : '1fr', gap: '1rem', alignItems: 'center' }}>
            {expenseByCategory.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={expenseByCategory}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                    >
                      {expenseByCategory.map((entry, index) => (
                        <Cell key={`expense-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="category-breakdown-list">
                  {expenseByCategory.map((item) => (
                    <div key={item.category} className="category-breakdown-item">
                      <div className="breakdown-item-header">
                        <span className="breakdown-item-name">
                          <span>{item.icon}</span>
                          <span>{item.category}</span>
                        </span>
                        <span className="breakdown-item-amount">
                          {formatRupiah(item.amount)} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="breakdown-progress-track">
                        <div
                          className="breakdown-progress-fill"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="chart-empty-state">
                <span className="chart-empty-icon">🏷️</span>
                <span className="chart-empty-text">No expense categories to show</span>
              </div>
            )}
          </div>
        </div>

        {/* Chart 4: Income by Category */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title-wrap">
              <h3 className="chart-title">Income by Category</h3>
              <span className="chart-subtitle">Sources of earned funds</span>
            </div>
            <span className="badge badge-income">
              {formatRupiah(stats.totalIncome)}
            </span>
          </div>

          <div className="chart-body" style={{ display: 'grid', gridTemplateColumns: incomeByCategory.length > 0 ? '1.1fr 1fr' : '1fr', gap: '1rem', alignItems: 'center' }}>
            {incomeByCategory.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={incomeByCategory}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                    >
                      {incomeByCategory.map((entry, index) => (
                        <Cell key={`income-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="category-breakdown-list">
                  {incomeByCategory.map((item) => (
                    <div key={item.category} className="category-breakdown-item">
                      <div className="breakdown-item-header">
                        <span className="breakdown-item-name">
                          <span>{item.icon}</span>
                          <span>{item.category}</span>
                        </span>
                        <span className="breakdown-item-amount">
                          {formatRupiah(item.amount)} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="breakdown-progress-track">
                        <div
                          className="breakdown-progress-fill"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="chart-empty-state">
                <span className="chart-empty-icon">💰</span>
                <span className="chart-empty-text">No income categories to show</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
