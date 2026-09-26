import React, { useState } from 'react'
import StatCard from '../components/StatCard'
import './Dashboard.css'

/**
 * Static Mock Data for Day 1
 */
const MOCK_SUMMARY = {
  totalBalance: 'Rp 3.250.000',
  totalIncome: 'Rp 5.000.000',
  totalExpense: 'Rp 1.750.000',
  transactionCount: '24',
}

const MOCK_MONTHLY_CHART = [
  { month: 'Apr', expense: 1200000, height: 40 },
  { month: 'May', expense: 1900000, height: 65 },
  { month: 'Jun', expense: 1400000, height: 48 },
  { month: 'Jul', expense: 2100000, height: 72 },
  { month: 'Aug', expense: 1600000, height: 55 },
  { month: 'Sep', expense: 1750000, height: 60, current: true },
]

const MOCK_TRANSACTIONS = [
  {
    id: 'tx-1',
    title: 'Makan Siang',
    category: 'Food',
    categoryType: 'food',
    icon: '🍔',
    date: 'Today, 12:45 PM',
    amount: '-Rp 25.000',
    type: 'expense',
  },
  {
    id: 'tx-2',
    title: 'Transportasi',
    category: 'Transportation',
    categoryType: 'transport',
    icon: '🚗',
    date: 'Today, 08:30 AM',
    amount: '-Rp 15.000',
    type: 'expense',
  },
  {
    id: 'tx-3',
    title: 'Freelance Project',
    category: 'Income',
    categoryType: 'income',
    icon: '💼',
    date: 'Yesterday, 03:20 PM',
    amount: '+Rp 500.000',
    type: 'income',
  },
  {
    id: 'tx-4',
    title: 'Buku Kuliah',
    category: 'Education',
    categoryType: 'education',
    icon: '📚',
    date: 'Sep 24, 2026',
    amount: '-Rp 75.000',
    type: 'expense',
  },
]

export default function Dashboard() {
  const [activeTimeframe, setActiveTimeframe] = useState('6M')
  const [hoveredMonth, setHoveredMonth] = useState('Sep')

  return (
    <div className="dashboard">
      {/* ==================================================
          STEP 5: Dashboard Header
          ================================================== */}
      <header className="dashboard-header">
        <div className="dashboard-title-group">
          <h1 className="dashboard-title">Good morning, Aji 👋</h1>
          <p className="dashboard-subtitle">Here's an overview of your finances.</p>
        </div>

        <div className="dashboard-header-actions">
          <div className="date-indicator">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>September 26, 2026</span>
          </div>

          <button
            type="button"
            className="header-action-btn"
            title="Transaction form will be added on Day 3"
          >
            <span>+ Add Transaction</span>
            <span className="header-action-tag">Day 3</span>
          </button>
        </div>
      </header>

      {/* ==================================================
          STEP 6: Summary Cards (4 Cards)
          ================================================== */}
      <section className="summary-grid" aria-label="Financial Summary Cards">
        <StatCard
          label="Total Balance"
          value={MOCK_SUMMARY.totalBalance}
          subtext="+12.4% vs last month"
          type="balance"
          badgeText="+12.4%"
          badgeTrend="up"
        />

        <StatCard
          label="Total Income"
          value={MOCK_SUMMARY.totalIncome}
          subtext="Main salary & freelance"
          type="income"
          badgeText="Active"
          badgeTrend="up"
        />

        <StatCard
          label="Total Expense"
          value={MOCK_SUMMARY.totalExpense}
          subtext="35% of total income"
          type="expense"
          badgeText="Normal"
          badgeTrend="down"
        />

        <StatCard
          label="Transactions"
          value={MOCK_SUMMARY.transactionCount}
          subtext="Logged this month"
          type="transactions"
          badgeText="+4 today"
          badgeTrend="neutral"
        />
      </section>

      {/* ==================================================
          STEP 7: Main Dashboard Content (Two Columns)
          ================================================== */}
      <div className="dashboard-main-grid">
        {/* SECTION A: Spending Overview */}
        <section className="dashboard-card" aria-label="Spending Overview">
          <div className="card-header-row">
            <div className="card-title-group">
              <h2 className="card-title">Spending Overview</h2>
              <span className="card-subtitle">Monthly spending</span>
            </div>

            <div className="chart-filter-pills">
              <button
                type="button"
                className={`chart-filter-btn ${activeTimeframe === '6M' ? 'active' : ''}`}
                onClick={() => setActiveTimeframe('6M')}
              >
                6 Months
              </button>
              <button
                type="button"
                className={`chart-filter-btn ${activeTimeframe === '1Y' ? 'active' : ''}`}
                onClick={() => setActiveTimeframe('1Y')}
              >
                This Year
              </button>
            </div>
          </div>

          {/* Polished Visual SVG Chart Placeholder without external libraries */}
          <div className="chart-visual-wrapper">
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot purple" />
                <span>Monthly Spending</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot emerald" />
                <span>Budget Limit (Rp 2.5M)</span>
              </div>
            </div>

            <svg
              className="svg-chart"
              viewBox="0 0 540 200"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="Spending bar chart showing monthly expenses from April to September"
            >
              {/* Background horizontal grid lines */}
              <line x1="50" y1="30" x2="520" y2="30" className="chart-grid-line" />
              <text x="42" y="34" className="chart-grid-text" textAnchor="end">Rp 3M</text>

              <line x1="50" y1="80" x2="520" y2="80" className="chart-grid-line" />
              <text x="42" y="84" className="chart-grid-text" textAnchor="end">Rp 2M</text>

              <line x1="50" y1="130" x2="520" y2="130" className="chart-grid-line" />
              <text x="42" y="134" className="chart-grid-text" textAnchor="end">Rp 1M</text>

              <line x1="50" y1="170" x2="520" y2="170" stroke="#cbd5e1" strokeWidth="1" />
              <text x="42" y="174" className="chart-grid-text" textAnchor="end">Rp 0</text>

              {/* Target budget reference line */}
              <line
                x1="50"
                y1="55"
                x2="520"
                y2="55"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                opacity="0.75"
              />

              {/* Monthly Bars */}
              {MOCK_MONTHLY_CHART.map((item, index) => {
                const barWidth = 38
                const spacing = 75
                const x = 75 + index * spacing
                const barHeight = item.height * 1.8
                const y = 170 - barHeight
                const isSelected = hoveredMonth === item.month

                return (
                  <g
                    key={item.month}
                    className={`chart-bar-group ${isSelected ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredMonth(item.month)}
                  >
                    {/* Background bar highlight */}
                    <rect
                      x={x - 4}
                      y="20"
                      width={barWidth + 8}
                      height="150"
                      rx="8"
                      fill={isSelected ? '#f3e8ff' : 'transparent'}
                      opacity={isSelected ? 0.6 : 0}
                    />

                    {/* Primary Bar */}
                    <rect
                      className="bar-primary"
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="6"
                      fill={item.current ? '#7c3aed' : '#c4b5fd'}
                    />

                    {/* Month Label */}
                    <text
                      x={x + barWidth / 2}
                      y="190"
                      className={`chart-month-label ${isSelected ? 'active' : ''}`}
                    >
                      {item.month}
                    </text>

                    {/* Value Pill on Active Bar */}
                    {isSelected && (
                      <g>
                        <rect
                          x={x - 14}
                          y={y - 28}
                          width={barWidth + 28}
                          height="22"
                          rx="4"
                          fill="#1e1b4b"
                        />
                        <text
                          x={x + barWidth / 2}
                          y={y - 13}
                          fill="#ffffff"
                          fontSize="9.5"
                          fontWeight="700"
                          textAnchor="middle"
                          fontFamily="sans-serif"
                        >
                          Rp {(item.expense / 1000000).toFixed(2)}M
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}
            </svg>

            <div className="chart-footer-note">
              <span>Showing 6-month historical spending pattern</span>
              <span className="chart-highlight-badge">
                Selected: {hoveredMonth} (Rp 1.750.000)
              </span>
            </div>
          </div>
        </section>

        {/* SECTION B: Recent Transactions */}
        <section className="dashboard-card" aria-label="Recent Transactions">
          <div className="card-header-row">
            <div className="card-title-group">
              <h2 className="card-title">Recent Transactions</h2>
              <span className="card-subtitle">Latest account movements</span>
            </div>

            <a href="#transactions" className="view-all-link">
              View all
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <ul className="transactions-list">
            {MOCK_TRANSACTIONS.map((tx) => (
              <li key={tx.id} className="transaction-item">
                <div className="transaction-left">
                  <div
                    className={`category-icon-box ${tx.categoryType}`}
                    aria-hidden="true"
                  >
                    {tx.icon}
                  </div>
                  <div className="transaction-details">
                    <span className="transaction-title">{tx.title}</span>
                    <div className="transaction-meta">
                      <span className="category-tag">{tx.category}</span>
                      <span>•</span>
                      <span>{tx.date}</span>
                    </div>
                  </div>
                </div>

                <div className="transaction-right">
                  <span className={`transaction-amount ${tx.type}`}>
                    {tx.amount}
                  </span>
                  <span className={`transaction-badge ${tx.type}`}>
                    {tx.type === 'income' ? 'Income' : 'Expense'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ==================================================
          STEP 8: Empty / Future State Hint
          ================================================== */}
      <section className="future-insights-card" aria-label="Future Insights">
        <div className="insights-content">
          <div className="insights-icon" aria-hidden="true">
            💡
          </div>
          <div className="insights-text-group">
            <h3 className="insights-title">Smart Financial Insights</h3>
            <p className="insights-desc">
              Your financial insights will appear here. Automated spending trends,
              budget health alerts, and savings opportunities will unlock on Day 6.
            </p>
          </div>
        </div>

        <span className="insights-badge">Roadmap: Day 6</span>
      </section>
    </div>
  )
}
