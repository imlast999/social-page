'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Terminal from './components/Terminal'
import ProjectsShowcase from './components/ProjectsShowcase'

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

export interface SocialItem {
  id: string
  label: string
  href?: string
  isAction?: boolean
  ethAddress?: string
  brandColor: string
  glowColor: string
}

const SOCIAL_ITEMS: SocialItem[] = [
  {
    id: 'instagram',
    label: 'instagram',
    href: 'https://instagram.com/imlast999',
    brandColor: '#E1306C',
    glowColor: 'rgba(225, 48, 108, 0.35)',
  },
  {
    id: 'twitter',
    label: 'twitter',
    href: 'https://twitter.com/imlast999',
    brandColor: '#1DA1F2',
    glowColor: 'rgba(29, 161, 242, 0.35)',
  },
  {
    id: 'tiktok',
    label: 'tiktok',
    href: 'https://tiktok.com/@imlast999_',
    brandColor: '#00F2FE',
    glowColor: 'rgba(0, 242, 254, 0.35)',
  },
  {
    id: 'telegram',
    label: 'telegram',
    href: 'https://t.me/imlast999',
    brandColor: '#2AABEE',
    glowColor: 'rgba(42, 171, 238, 0.35)',
  },
  {
    id: 'twitch',
    label: 'twitch',
    href: 'https://twitch.tv/imlast999',
    brandColor: '#9146FF',
    glowColor: 'rgba(145, 70, 255, 0.35)',
  },
  {
    id: 'spotify',
    label: 'spotify',
    href: 'https://open.spotify.com/user/31ezp7nbkqtopvtodymrdipbr22m',
    brandColor: '#1ED760',
    glowColor: 'rgba(30, 215, 96, 0.35)',
  },
  {
    id: 'steam',
    label: 'steam',
    href: 'https://steamcommunity.com/id/imlast999',
    brandColor: '#66C0F4',
    glowColor: 'rgba(102, 192, 244, 0.35)',
  },
  {
    id: 'roblox',
    label: 'roblox',
    href: 'https://roblox.com/users/1193901121/profile',
    brandColor: '#FF2A2A',
    glowColor: 'rgba(255, 42, 42, 0.35)',
  },
  {
    id: 'github',
    label: 'github',
    href: 'https://github.com/imlast999',
    brandColor: '#F0F6FC',
    glowColor: 'rgba(240, 246, 252, 0.3)',
  },
  {
    id: 'ethereum',
    label: 'ethereum',
    isAction: true,
    ethAddress: '0x2232047f31888e6EAdC21d920E8FC4BD3ccDE13f',
    brandColor: '#627EEA',
    glowColor: 'rgba(98, 126, 234, 0.4)',
  },
  {
    id: 'abstract',
    label: 'abstract',
    href: 'https://portal.abs.xyz/profile/0x73c83FD4803095f2da1D2b4C74D6332abbd100AD',
    brandColor: '#00FF88',
    glowColor: 'rgba(0, 255, 136, 0.4)',
  },
  {
    id: 'fomo',
    label: 'fomo',
    href: 'https://fomo.family/r/imlast999',
    brandColor: '#F0F6FC',
    glowColor: 'rgba(240, 246, 252, 0.3)',
  },
]

// Scatter presets for letter hover effect
const SCATTER_PRESETS = [
  { x: '-15%', y: '50%', rotate: 8 },
  { x: '-25%', y: '25%', rotate: 4 },
  { x: '-20%', y: '40%', rotate: -6 },
  { x: '10%', y: '12%', rotate: -8 },
  { x: '-10%', y: '-22%', rotate: 6 },
  { x: '14%', y: '22%', rotate: -4 },
  { x: '-8%', y: '-30%', rotate: -6 },
  { x: '16%', y: '16%', rotate: 9 },
  { x: '-14%', y: '28%', rotate: -5 },
  { x: '12%', y: '-18%', rotate: 8 },
]

function getScatterTransform(index: number) {
  return SCATTER_PRESETS[index % SCATTER_PRESETS.length]
}

interface ItemPos {
  x: number
  y: number
}

interface Star {
  x: number
  y: number
  z: number
  radius: number
  baseAlpha: number
  twinkleSpeed: number
  phase: number
}

export default function SocialLinksMatrix() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map())
  const floatRefs = useRef<Map<string, HTMLElement>>(new Map())
  const [positions, setPositions] = useState<Record<string, ItemPos>>({})
  const [copiedEth, setCopiedEth] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Mouse & Gyroscope position ref for smooth canvas parallax
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })

  // 1. Interactive Starfield Canvas with Mobile Gyroscope Parallax
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Generate stars with 3D depth (z)
    const starCount = 145
    const stars: Star[] = []
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: 0.2 + Math.random() * 0.8,
        radius: 0.8 + Math.random() * 1.5,
        baseAlpha: 0.25 + Math.random() * 0.6,
        twinkleSpeed: 0.01 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
      })
    }

    // Desktop Mouse Move
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX - width / 2) / (width / 2)
      mouseRef.current.targetY = (e.clientY - height / 2) / (height / 2)
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Mobile DeviceOrientation (Gyroscope Tilt)
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return
      // gamma is left/right tilt [-90, 90]
      // beta is front/back tilt [-180, 180]
      const clampedGamma = Math.max(-45, Math.min(45, e.gamma))
      const clampedBeta = Math.max(-45, Math.min(45, e.beta - 40))
      mouseRef.current.targetX = clampedGamma / 45
      mouseRef.current.targetY = clampedBeta / 45
    }
    window.addEventListener('deviceorientation', handleOrientation)

    // Render loop
    let time = 0
    const render = () => {
      time += 0.02

      // Smooth lerp for elastic parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.045
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.045

      ctx.clearRect(0, 0, width, height)

      // Draw 3D Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]
        const parallaxAmount = star.z * 35
        const starX = star.x + mouseRef.current.x * parallaxAmount
        const starY = star.y + mouseRef.current.y * parallaxAmount

        const modX = ((starX % width) + width) % width
        const modY = ((starY % height) + height) % height

        const alpha = Math.max(
          0.1,
          Math.min(
            1,
            star.baseAlpha + Math.sin(time * star.twinkleSpeed * 50 + star.phase) * 0.25
          )
        )

        ctx.beginPath()
        ctx.arc(modX, modY, star.radius * star.z, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('deviceorientation', handleOrientation)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // 2. Compute non-overlapping random positions inside the Hero view
  const computeNonOverlappingPositions = useCallback(() => {
    if (!heroRef.current) return

    const W = heroRef.current.clientWidth || window.innerWidth
    const isMobile = W < 640
    const isTablet = W < 1024 && !isMobile

    // Keep links neatly inside the hero screen
    const H = isMobile
      ? Math.max(window.innerHeight - 100, 1100)
      : isTablet
      ? Math.max(window.innerHeight - 100, 850)
      : Math.max(window.innerHeight - 120, 700)

    const padX = isMobile ? 24 : 50
    const padY = isMobile ? 30 : 50
    const minGap = isMobile ? 22 : 44

    const availW = W - padX * 2
    const availH = H - padY * 2

    const getEstimatedSize = (id: string) => {
      const item = SOCIAL_ITEMS.find((s) => s.id === id)
      const len = item?.label.length || 6
      const charW = isMobile ? 18 : 26
      const textH = isMobile ? 42 : 58
      return { w: len * charW + 20, h: textH }
    }

    const shuffled = [...SOCIAL_ITEMS].sort(() => Math.random() - 0.5)
    const placedList: { id: string; x: number; y: number; w: number; h: number }[] = []

    function collides(rect: { x: number; y: number; w: number; h: number }) {
      return placedList.some(
        (o) =>
          !(
            rect.x + rect.w + minGap <= o.x ||
            o.x + o.w + minGap <= rect.x ||
            rect.y + rect.h + minGap <= o.y ||
            o.y + o.h + minGap <= rect.y
          )
      )
    }

    // Pass 1: Rejection sampling
    let allPlaced = true
    for (const item of shuffled) {
      const el = itemRefs.current.get(item.id)
      const measuredW = el ? el.offsetWidth : undefined
      const measuredH = el ? el.offsetHeight : undefined
      const est = getEstimatedSize(item.id)

      const itemW = measuredW && measuredW > 0 ? measuredW : est.w
      const itemH = measuredH && measuredH > 0 ? measuredH : est.h

      const maxX = padX + availW - itemW
      const maxY = padY + availH - itemH

      let placed = false
      if (maxX > padX && maxY > padY) {
        for (let attempt = 0; attempt < 500; attempt++) {
          const candidateX = Math.floor(padX + Math.random() * (maxX - padX))
          const candidateY = Math.floor(padY + Math.random() * (maxY - padY))
          const candidate = { x: candidateX, y: candidateY, w: itemW, h: itemH }

          if (!collides(candidate)) {
            placedList.push({ id: item.id, ...candidate })
            placed = true
            break
          }
        }
      }

      if (!placed) {
        allPlaced = false
        break
      }
    }

    // Pass 2: Jittered grid fallback
    if (!allPlaced) {
      placedList.length = 0
      const cols = isMobile ? 2 : isTablet ? 3 : 4
      const rows = Math.ceil(shuffled.length / cols)
      const cellW = availW / cols
      const cellH = availH / rows

      const slots: { c: number; r: number }[] = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          slots.push({ c, r })
        }
      }
      slots.sort(() => Math.random() - 0.5)

      for (let i = 0; i < shuffled.length; i++) {
        const item = shuffled[i]
        const slot = slots[i]
        const el = itemRefs.current.get(item.id)
        const est = getEstimatedSize(item.id)
        const itemW = Math.min(cellW - minGap, el?.offsetWidth || est.w)
        const itemH = Math.min(cellH - minGap, el?.offsetHeight || est.h)

        const cellLeft = padX + slot.c * cellW
        const cellTop = padY + slot.r * cellH

        const maxJitterX = Math.max(0, cellW - itemW - minGap)
        const maxJitterY = Math.max(0, cellH - itemH - minGap)

        const x = Math.round(cellLeft + minGap / 2 + Math.random() * maxJitterX)
        const y = Math.round(cellTop + minGap / 2 + Math.random() * maxJitterY)

        placedList.push({ id: item.id, x, y, w: itemW, h: itemH })
      }
    }

    const newPositions: Record<string, ItemPos> = {}
    placedList.forEach((p) => {
      newPositions[p.id] = { x: p.x, y: p.y }
    })

    setPositions(newPositions)
  }, [])

  useEffect(() => {
    setMounted(true)
    computeNonOverlappingPositions()

    let resizeTimer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        computeNonOverlappingPositions()
      }, 150)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer)
    }
  }, [computeNonOverlappingPositions])

  // GSAP animation for position updates + start subtle zero-gravity floating
  useEffect(() => {
    if (!mounted || Object.keys(positions).length === 0) return

    SOCIAL_ITEMS.forEach((item) => {
      const el = itemRefs.current.get(item.id)
      const floatEl = floatRefs.current.get(item.id)
      const pos = positions[item.id]

      if (el && pos) {
        gsap.to(el, {
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          duration: 0.8,
          ease: 'power3.out',
        })
      }

      // Organic Zero-Gravity Idle Floating Motion
      if (floatEl) {
        gsap.killTweensOf(floatEl)
        const floatDistanceY = 4 + Math.random() * 3
        const floatDistanceX = (Math.random() - 0.5) * 3
        const duration = 3.2 + Math.random() * 2.5
        const randomDelay = Math.random() * 1.5

        gsap.to(floatEl, {
          y: `+=${floatDistanceY}`,
          x: `+=${floatDistanceX}`,
          rotation: (Math.random() - 0.5) * 1.5,
          duration,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: randomDelay,
        })
      }
    })
  }, [positions, mounted])

  // Ethereum Copy Handler
  const handleCopyEthereum = () => {
    const ethAddress = '0x2232047f31888e6EAdC21d920E8FC4BD3ccDE13f'

    const triggerSuccess = () => {
      setCopiedEth(true)
      setToastMessage(`ethereum wallet copied: ${ethAddress}`)

      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
      toastTimeoutRef.current = setTimeout(() => {
        setCopiedEth(false)
        setToastMessage(null)
      }, 3000)
    }

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(ethAddress)
        .then(triggerSuccess)
        .catch(() => {
          fallbackCopy(ethAddress)
          triggerSuccess()
        })
    } else {
      fallbackCopy(ethAddress)
      triggerSuccess()
    }
  }

  const fallbackCopy = (text: string) => {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    } catch (e) {
      console.warn('Fallback copy error:', e)
    }
  }

  // Hover scatter letters animation
  const handleMouseEnter = (itemEl: HTMLElement | null) => {
    if (!itemEl) return
    const letterOuters = itemEl.querySelectorAll<HTMLElement>('.scatter-outer')
    const letterInners = itemEl.querySelectorAll<HTMLElement>('.scatter-inner')

    letterOuters.forEach((outer, i) => {
      const transform = getScatterTransform(i + 1)
      gsap.to(outer, {
        xPercent: parseFloat(transform.x),
        yPercent: parseFloat(transform.y),
        rotation: transform.rotate,
        duration: 0.22,
        ease: 'power3.inOut',
      })
    })

    letterInners.forEach((inner) => {
      const randomDelay = Math.random() * 0.4
      gsap.to(inner, {
        keyframes: [
          { yPercent: 0, duration: 0 },
          { yPercent: -4, duration: 2.2, ease: 'power3.inOut' },
          { yPercent: 0, duration: 2.2, ease: 'power3.inOut' },
        ],
        repeat: -1,
        delay: randomDelay,
      })
    })
  }

  const handleMouseLeave = (itemEl: HTMLElement | null) => {
    if (!itemEl) return
    const letterOuters = itemEl.querySelectorAll<HTMLElement>('.scatter-outer')
    const letterInners = itemEl.querySelectorAll<HTMLElement>('.scatter-inner')

    letterInners.forEach((inner) => {
      gsap.killTweensOf(inner)
      gsap.to(inner, {
        yPercent: 0,
        duration: 0.35,
        ease: 'power3.inOut',
      })
    })

    letterOuters.forEach((outer) => {
      gsap.to(outer, {
        xPercent: 0,
        yPercent: 0,
        rotation: 0,
        duration: 0.35,
        ease: 'power3.inOut',
      })
    })
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#050508] overflow-x-hidden select-none"
    >
      {/* Interactive Space Background Canvas (Fixed behind all sections) */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0 w-full h-full"
      />

      {/* ========================================================= */}
      {/* SECTION 1: HERO SCATTERED COSMIC LINKS MATRIX             */}
      {/* ========================================================= */}
      <section
        ref={heroRef}
        className="relative min-h-screen w-full flex flex-col justify-between"
      >
        {/* Absolute Floating Links Container */}
        <div className="relative w-full flex-1">
          {SOCIAL_ITEMS.map((item) => {
            const isEth = item.id === 'ethereum'
            const currentText = isEth && copiedEth ? 'copied!' : item.label
            const letters = currentText.split('')

            const wordElement = (
              <div
                ref={(el) => {
                  if (el) floatRefs.current.set(item.id, el)
                  else floatRefs.current.delete(item.id)
                }}
                className="group relative inline-block cursor-pointer"
                style={
                  {
                    '--brand-color': item.brandColor,
                    '--glow-color': item.glowColor,
                  } as React.CSSProperties
                }
              >
                {/* Soft Brand Spotlight behind word on hover */}
                <div
                  className="pointer-events-none absolute -inset-6 -z-10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-out"
                  style={{
                    background:
                      item.id === 'tiktok'
                        ? 'radial-gradient(ellipse at center, rgba(37, 244, 238, 0.3) 0%, rgba(254, 44, 85, 0.3) 60%, transparent 80%)'
                        : `radial-gradient(circle, ${item.glowColor} 0%, transparent 70%)`,
                  }}
                />

                {/* Main word letters with scatter & hover brand color */}
                <span
                  className={cn(
                    'fancy-word inline-flex items-center text-4xl sm:text-5xl md:text-6xl font-medium lowercase tracking-normal transition-colors duration-250',
                    isEth && copiedEth
                      ? 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                      : 'text-white'
                  )}
                >
                  {letters.map((char, i) => {
                    let hoverColor = 'group-hover:text-[var(--brand-color)]'
                    if (item.id === 'tiktok') {
                      hoverColor =
                        i < 3
                          ? 'group-hover:text-[#25F4EE]'
                          : 'group-hover:text-[#FE2C55]'
                    }
                    return (
                      <span key={i} className="scatter-outer inline-block">
                        <span className="scatter-inner inline-block">
                          <span
                            className={cn(
                              'inline-block transition-colors duration-200',
                              hoverColor
                            )}
                          >
                            {char}
                          </span>
                        </span>
                      </span>
                    )
                  })}
                </span>
              </div>
            )

            const commonProps = {
              ref: (el: HTMLElement | null) => {
                if (el) itemRefs.current.set(item.id, el)
                else itemRefs.current.delete(item.id)
              },
              style: {
                position: 'absolute' as const,
                left: positions[item.id] ? `${positions[item.id].x}px` : '50%',
                top: positions[item.id] ? `${positions[item.id].y}px` : '50%',
                opacity: mounted && positions[item.id] ? 1 : 0,
                transition: 'opacity 0.4s ease',
              },
              onMouseEnter: (e: React.MouseEvent<HTMLElement>) =>
                handleMouseEnter(e.currentTarget),
              onMouseLeave: (e: React.MouseEvent<HTMLElement>) =>
                handleMouseLeave(e.currentTarget),
            }

            if (isEth) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={handleCopyEthereum}
                  className="outline-none focus:outline-none cursor-pointer bg-transparent border-none p-0 m-0 text-left z-10"
                  aria-label="copy ethereum address"
                  {...commonProps}
                >
                  {wordElement}
                </button>
              )
            }

            return (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="outline-none focus:outline-none no-underline block text-left z-10"
                aria-label={`open ${item.label}`}
                {...commonProps}
              >
                {wordElement}
              </a>
            )
          })}
        </div>

        {/* Scroll Indicator Prompt at bottom of Hero */}
        <div className="relative z-20 pb-8 flex flex-col items-center justify-center pointer-events-auto">
          <button
            type="button"
            onClick={() => scrollToSection('terminal-section')}
            className="group flex flex-col items-center gap-2 text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer outline-none"
            aria-label="Scroll to terminal section"
          >
            <span className="text-[11px] font-mono tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">
              scroll to explore
            </span>
            <div className="w-5 h-8 rounded-full border border-zinc-700/80 flex items-start justify-center p-1 group-hover:border-zinc-500 transition-colors">
              <span className="w-1 h-2 rounded-full bg-emerald-400 animate-bounce" />
            </div>
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: INTERACTIVE HACKER TERMINAL (imlast999 ~ $)    */}
      {/* ========================================================= */}
      <section
        id="terminal-section"
        className="relative z-10 w-full py-16 sm:py-24 border-t border-zinc-900/80 bg-gradient-to-b from-transparent via-[#08080d]/80 to-transparent"
      >
        <div className="max-w-4xl mx-auto text-center px-4 mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>INTERACTIVE CONSOLE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
            terminal access
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono">
            Type commands or tap any suggested chip below
          </p>
        </div>

        <Terminal onExploreProjects={() => scrollToSection('projects-section')} />
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: HOLOGRAPHIC PROJECTS SHOWCASE                  */}
      {/* ========================================================= */}
      <section className="relative z-10 w-full border-t border-zinc-900/80">
        <ProjectsShowcase />
      </section>

      {/* ========================================================= */}
      {/* FOOTER & BACK TO TOP                                      */}
      {/* ========================================================= */}
      <footer className="relative z-10 w-full py-12 px-6 border-t border-zinc-900/90 text-center space-y-4">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/70 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <span>back to orbit</span>
          <span>↑</span>
        </button>

        <div className="text-xs font-mono text-zinc-500 flex items-center justify-center gap-2 flex-wrap">
          <span>imlast999</span>
          <span>·</span>
          <span className="text-emerald-400/80">imlast999.is-a.dev</span>
          <span>·</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </footer>

      {/* Floating Toast for Ethereum Copy */}
      <div
        className={cn(
          'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2 rounded-xl backdrop-blur-md bg-zinc-900/90 border border-emerald-500/30 text-emerald-400 shadow-xl transition-all duration-300 font-mono text-xs',
          toastMessage
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-3 pointer-events-none'
        )}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>{toastMessage}</span>
      </div>
    </main>
  )
}
