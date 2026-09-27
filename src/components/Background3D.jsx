import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './Background3D.css'

/**
 * Background3D renders an ultra-subtle futuristic Three.js particle constellation
 * and orbital ring network with cursor parallax.
 */
export default function Background3D() {
  const mountRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 7

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Particle Constellation
    const isMobile = window.innerWidth < 768
    const particleCount = isMobile ? 120 : 280
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    // Palette: cyan, purple, violet, blue
    const palette = [
      new THREE.Color(0x22d3ee), // cyan
      new THREE.Color(0x8b5cf6), // purple
      new THREE.Color(0xa855f7), // violet
      new THREE.Color(0x3b82f6), // blue
    ]

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2

      const color = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const particleMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.05 : 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    })

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particleSystem)

    // Orbital Rings
    const ringGroup = new THREE.Group()

    const ringGeo1 = new THREE.TorusGeometry(3.6, 0.012, 12, 90)
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.18,
      wireframe: true,
    })
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1)
    ring1.rotation.x = Math.PI / 3.5
    ring1.rotation.y = Math.PI / 6
    ringGroup.add(ring1)

    const ringGeo2 = new THREE.TorusGeometry(4.8, 0.01, 12, 100)
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.12,
      wireframe: true,
    })
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2)
    ring2.rotation.x = -Math.PI / 4
    ring2.rotation.z = Math.PI / 5
    ringGroup.add(ring2)

    scene.add(ringGroup)

    // Cursor Parallax state
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      targetX = x * 0.45
      targetY = y * 0.35
    }

    if (!prefersReducedMotion) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
    }

    // Resize handler
    const handleResize = () => {
      if (!camera || !renderer) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    window.addEventListener('resize', handleResize)

    // Animation Loop
    let animationFrameId = null
    const clock = new THREE.Clock()

    const animate = () => {
      if (prefersReducedMotion) {
        renderer.render(scene, camera)
        return
      }

      animationFrameId = requestAnimationFrame(animate)

      const elapsedTime = clock.getElapsedTime()

      // Smooth parallax
      currentX += (targetX - currentX) * 0.05
      currentY += (targetY - currentY) * 0.05

      camera.position.x = currentX
      camera.position.y = currentY
      camera.lookAt(scene.position)

      // Slow orbital ring rotations
      ring1.rotation.z = elapsedTime * 0.04
      ring2.rotation.y = -elapsedTime * 0.03
      ringGroup.rotation.y = elapsedTime * 0.015

      // Very subtle wave on particles
      particleSystem.rotation.y = elapsedTime * 0.02

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }

      particleGeometry.dispose()
      particleMaterial.dispose()
      ringGeo1.dispose()
      ringMat1.dispose()
      ringGeo2.dispose()
      ringMat2.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <>
      <div ref={mountRef} className="background-3d-canvas" aria-hidden="true" />
      <div className="background-ambient-overlay" aria-hidden="true" />
    </>
  )
}
