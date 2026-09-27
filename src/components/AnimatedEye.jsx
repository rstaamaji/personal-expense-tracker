import React, { useState, useEffect, useRef, useMemo } from 'react'
import { formatRupiah } from '../utils/formatters'
import './AnimatedEye.css'

/**
 * AnimatedEye: The signature futuristic "Financial Vision / AI Eye" component.
 * Features an interactive cursor-reactive iris, automated natural blinking,
 * technological radial data segments inspired by the design reference, and floating HUD callouts.
 *
 * @param {object} props
 * @param {object} props.stats - Live financial statistics (totalBalance, totalIncome, totalExpense, etc.)
 */
export default function AnimatedEye({ stats }) {
  const containerRef = useRef(null)
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })
  const [isBlinking, setIsBlinking] = useState(false)

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Generate 54 technological radial iris ticks with continuous color spectrum
  const irisTicks = useMemo(() => {
    const ticks = []
    const totalTicks = 54
    const cx = 125
    const cy = 125
    const rInner = 73
    const rOuter = 118

    // Palette interpolation
    const colors = [
      '#F97316', // Orange
      '#EC4899', // Pink / Magenta
      '#A855F7', // Violet
      '#8B5CF6', // Purple
      '#3B82F6', // Blue
      '#22D3EE', // Cyan
    ]

    for (let i = 0; i < totalTicks; i++) {
      const angle = (i / totalTicks) * Math.PI * 2
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)

      const x1 = cx + rInner * cos
      const y1 = cy + rInner * sin
      const x2 = cx + rOuter * cos
      const y2 = cy + rOuter * sin

      // Color selection around the circle
      const colorIndex = Math.floor((i / totalTicks) * colors.length)
      const color = colors[colorIndex % colors.length]

      // Slight thickness/length variation for data-track appearance
      const strokeWidth = i % 2 === 0 ? 3.5 : 2.2
      const opacity = i % 3 === 0 ? 0.95 : 0.8

      ticks.push({
        id: `tick-${i}`,
        x1,
        y1,
        x2,
        y2,
        color,
        strokeWidth,
        opacity,
      })
    }
    return ticks
  }, [])

  // Cursor Tracking with subtle constrained movement
  useEffect(() => {
    if (prefersReducedMotion) return

    let rafId = null
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const handleMouseMove = (e) => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Normalize between -1 and 1
      const normalizedX = (e.clientX - centerX) / (window.innerWidth / 2)
      const normalizedY = (e.clientY - centerY) / (window.innerHeight / 2)

      // Maximum offset in pixels
      targetX = Math.max(-20, Math.min(20, normalizedX * 22))
      targetY = Math.max(-13, Math.min(13, normalizedY * 15))
    }

    const animateMovement = () => {
      currentX += (targetX - currentX) * 0.08
      currentY += (targetY - currentY) * 0.08

      setEyeOffset({
        x: Math.round(currentX * 100) / 100,
        y: Math.round(currentY * 100) / 100,
      })

      rafId = requestAnimationFrame(animateMovement)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    rafId = requestAnimationFrame(animateMovement)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [prefersReducedMotion])

  // Automated Natural Blinking Cycle
  useEffect(() => {
    if (prefersReducedMotion) return

    let blinkTimeout = null

    const scheduleNextBlink = () => {
      // Random interval between 3200ms and 6500ms
      const interval = 3200 + Math.random() * 3300
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true)

        // Blink duration 140ms
        setTimeout(() => {
          setIsBlinking(false)
          scheduleNextBlink()
        }, 140)
      }, interval)
    }

    scheduleNextBlink()

    return () => {
      if (blinkTimeout) clearTimeout(blinkTimeout)
    }
  }, [prefersReducedMotion])

  return (
    <div
      ref={containerRef}
      className="eye-stage-container"
      role="region"
      aria-label="Financial Vision AI Eye Intelligence Monitor"
    >
      {/* Ambient background glow */}
      <div className="eye-ambient-glow" aria-hidden="true" />

      {/* Floating HUD Callout 1 (Top Left): Savings Rate */}
      <div className="eye-hud-badge badge-savings" title="Current retained savings rate">
        <span className="hud-indicator" />
        <div className="hud-data-text">
          <span className="hud-data-label">Savings Velocity</span>
          <span className="hud-data-val">{stats.savingsRate}%</span>
        </div>
      </div>

      {/* Floating HUD Callout 2 (Top Right): Total Income */}
      <div className="eye-hud-badge badge-income" title="Accumulated revenue">
        <span className="hud-indicator" />
        <div className="hud-data-text">
          <span className="hud-data-label">Total Inflow</span>
          <span className="hud-data-val">{formatRupiah(stats.totalIncome)}</span>
        </div>
      </div>

      {/* Floating HUD Callout 3 (Bottom Left): Total Transactions */}
      <div className="eye-hud-badge badge-txs" title="Transactions recorded">
        <span className="hud-indicator" />
        <div className="hud-data-text">
          <span className="hud-data-label">Audited Nodes</span>
          <span className="hud-data-val">{stats.transactionCount} Logs</span>
        </div>
      </div>

      {/* Floating HUD Callout 4 (Bottom Right): Total Expense */}
      <div className="eye-hud-badge badge-expense" title="Expenditure recorded">
        <span className="hud-indicator" />
        <div className="hud-data-text">
          <span className="hud-data-label">Total Outflow</span>
          <span className="hud-data-val">{formatRupiah(stats.totalExpense)}</span>
        </div>
      </div>

      {/* Outer Eye Contour Frame */}
      <div className={`eye-contour-frame ${isBlinking ? 'blinking' : ''}`}>
        {/* Animated Eyelids */}
        <div className="eyelid eyelid-top" aria-hidden="true" />
        <div className="eyelid eyelid-bottom" aria-hidden="true" />

        {/* Eyelash silhouettes */}
        <div className="eye-lash-silhouette-top" aria-hidden="true" />
        <div className="eye-lash-silhouette-bottom" aria-hidden="true" />

        {/* Eye Globe & Iris Glide (Translates with cursor) */}
        <div
          className="eye-globe-glide"
          style={{
            transform: `translate3d(${eyeOffset.x}px, ${eyeOffset.y}px, 0)`,
          }}
        >
          {/* Subtle outer tech rings */}
          <div className="iris-outer-ring" aria-hidden="true" />
          <div className="iris-glow-rim" aria-hidden="true" />

          {/* Technological Segmented Iris SVG */}
          <svg
            className="iris-segmented-svg"
            viewBox="0 0 250 250"
            role="img"
            aria-label="Technological Iris displaying radial financial data streams"
          >
            <defs>
              <filter id="irisGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Glowing Concentric Guide Rings */}
            <circle cx="125" cy="125" r="71" fill="none" stroke="rgba(34, 211, 238, 0.25)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="125" cy="125" r="95" fill="none" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="0.8" />
            <circle cx="125" cy="125" r="118" fill="none" stroke="rgba(34, 211, 238, 0.35)" strokeWidth="1.2" />

            {/* Radial Data Ticks */}
            <g filter="url(#irisGlow)">
              {irisTicks.map((tick) => (
                <line
                  key={tick.id}
                  x1={tick.x1}
                  y1={tick.y1}
                  x2={tick.x2}
                  y2={tick.y2}
                  stroke={tick.color}
                  strokeWidth={tick.strokeWidth}
                  strokeLinecap="round"
                  opacity={tick.opacity}
                />
              ))}
            </g>
          </svg>

          {/* Pupil Core (Financial Intelligence Metrics) */}
          <div className="pupil-core">
            <div className="pupil-scan-line" aria-hidden="true" />
            <span className="pupil-metric-label">NET BALANCE</span>
            <span className="pupil-metric-value">{formatRupiah(stats.totalBalance)}</span>
            <span className="pupil-metric-sub">
              {stats.totalBalance >= 0 ? '● SOLVENT' : '▲ DEFICIT'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
