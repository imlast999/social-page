'use client'

import React, { useState, useRef, useCallback } from 'react'

interface Project {
  id: string
  title: string
  subtitle: string
  category: string
  status: 'live' | 'building' | 'concept'
  statusText: string
  description: string
  tags: string[]
  liveUrl?: string
  githubUrl?: string
  highlights: string[]
  accentColor: string
  glowColor: string
}

const PROJECTS: Project[] = [
  {
    id: 'lastedge',
    title: 'LastEdge',
    subtitle: 'Quantitative Trading Platform for MetaTrader 5',
    category: 'Quantitative Systems / Algo Trading',
    status: 'live',
    statusText: 'ACTIVE REPOSITORY',
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    description:
      'Research-first quantitative trading platform for MetaTrader 5. Build, validate, and deploy systematic trading strategies using backtesting, walk-forward analysis, Monte Carlo simulation, exit research, live execution, and real-time monitoring.',
    tags: ['Python', 'TypeScript', 'MetaTrader 5', 'Backtesting', 'Strategy Lab'],
    githubUrl: 'https://github.com/imlast999/LastEdge',
    highlights: [
      'Walk-forward analysis & Monte Carlo risk simulation',
      'Automated MetaTrader 5 live execution bridge',
      'Strategy lab with systematic exit & edge research',
      'Modular architecture (App, Lab, Trading Engine)',
    ],
  },
  {
    id: 'millionaire-sharks',
    title: 'Millionaire Sharks Club',
    subtitle: 'Web3 & Exclusive Community Portal',
    category: 'Web3 / Production Platform',
    status: 'live',
    statusText: 'LIVE PRODUCTION',
    accentColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.25)',
    description:
      'Official website and digital portal for the Millionaire Sharks Club ecosystem, showcasing community utility, roadmap milestones, and Web3 integration.',
    tags: ['Web3', 'Next.js', 'React', 'TailwindCSS', 'Community'],
    liveUrl: 'https://millionairesharks.com',
    highlights: [
      'Interactive community & roadmap experience',
      'Optimized high-speed responsive Web3 architecture',
      'Digital asset showcases and ecosystem portal navigation',
    ],
  },
  {
    id: 'spotify-ui',
    title: 'SpotifyUI',
    subtitle: 'Android MP3 Player UI Transformation',
    category: 'Android / UI Engineering',
    status: 'building',
    statusText: 'PERSONAL APP / IN CRAFTING',
    accentColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    description:
      'Custom Android application that revamps your mobile UI into a dedicated, distraction-free minimalist MP3 player with a sleek, music-centric aesthetic.',
    tags: ['Android', 'Kotlin', 'Audio Player', 'UI/UX Design', 'Minimalist'],
    highlights: [
      'Transforms mobile UI into a dedicated MP3 player',
      'Distraction-free minimalist playback interface',
      'Offline local audio indexing and sleek visualizer',
    ],
  },
]

function ProjectCard({
  project,
  isActive,
  offset,
}: {
  project: Project
  isActive: boolean
  offset: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ x: 0, y: 0, percentX: 50, percentY: 50 })
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, isHovered: false })
  const [showDetails, setShowDetails] = useState(false)

  // 3D Card Tilt Physics & Holographic Angle Tracking
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const percentX = (x / rect.width) * 100
    const percentY = (y / rect.height) * 100

    // Tilt angle (-7deg to +7deg)
    const maxTilt = 7
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * maxTilt
    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * maxTilt

    setCoords({ x, y, percentX, percentY })
    setTilt({ rotateX, rotateY, isHovered: true })
  }, [isActive])

  const handleMouseLeave = useCallback(() => {
    if (!isActive) return
    setTilt({ rotateX: 0, rotateY: 0, isHovered: false })
  }, [isActive])

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isActive || !cardRef.current || !e.touches[0]) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const y = e.touches[0].clientY - rect.top
    const percentX = (x / rect.width) * 100
    const percentY = (y / rect.height) * 100
    setCoords({ x, y, percentX, percentY })
  }, [isActive])

  const getStatusBadge = () => {
    switch (project.status) {
      case 'live':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {project.statusText}
          </span>
        )
      case 'building':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            {project.statusText}
          </span>
        )
      case 'concept':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium tracking-wide bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-[0_0_12px_rgba(14,165,233,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            {project.statusText}
          </span>
        )
    }
  }

  // Right-offset stacking calculations with vibrant visibility
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false
  const stepX = isMobile ? 26 : 44
  const stepY = isMobile ? 8 : 12

  const translateX = offset * stepX
  const translateY = offset * stepY
  const scale = 1 - offset * 0.032
  const opacity = offset === 0 ? 1 : offset === 1 ? 0.94 : 0.82
  const zIndex = 30 - offset * 10

  return (
    <div
      style={{
        perspective: '1200px',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex,
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        style={{
          transform: isActive
            ? `translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
            : `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
          opacity,
          transformOrigin: 'left center',
          transition: tilt.isHovered
            ? 'transform 0.1s ease-out, box-shadow 0.3s ease'
            : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease, border-color 0.3s ease, box-shadow 0.4s ease',
          boxShadow: isActive
            ? `0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 40px ${project.glowColor}, inset 0 1px 1px rgba(255, 255, 255, 0.15)`
            : offset === 1
            ? `0 20px 40px rgba(0, 0, 0, 0.85), 0 0 25px ${project.glowColor}, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
            : `0 15px 30px rgba(0, 0, 0, 0.8), 0 0 15px ${project.glowColor}`,
        }}
        className={`w-[calc(100%-54px)] sm:w-[calc(100%-92px)] rounded-2xl p-6 sm:p-8 backdrop-blur-3xl flex flex-col justify-between overflow-hidden relative ${
          isActive
            ? 'bg-gradient-to-br from-[#0c0c14]/98 via-[#090910]/95 to-[#06060a]/98 border border-zinc-500/80 ring-1 ring-white/10 cursor-default'
            : offset === 1
            ? 'bg-gradient-to-br from-[#12121e]/98 via-[#0e0e18]/95 to-[#090912]/98 border border-zinc-600/90 select-none'
            : 'bg-gradient-to-br from-[#151522]/98 via-[#10101c]/95 to-[#0b0b14]/98 border border-zinc-700/80 select-none'
        }`}
      >
        {/* Holographic Dynamic Specular Sheen on Active Card */}
        {isActive && (
          <div
            className={`pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 ${
              tilt.isHovered ? 'opacity-85' : 'opacity-25'
            }`}
            style={{
              background: `radial-gradient(550px circle at ${coords.percentX}% ${coords.percentY}%, rgba(255, 255, 255, 0.08) 0%, rgba(6, 182, 212, 0.06) 25%, rgba(168, 85, 247, 0.05) 50%, transparent 80%)`,
            }}
          />
        )}

        {/* Ambient Top Light Beam */}
        <div 
          className="pointer-events-none absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: isActive
              ? `linear-gradient(90deg, transparent, ${project.accentColor} 30%, rgba(255,255,255,0.8) 50%, ${project.accentColor} 70%, transparent)`
              : `linear-gradient(90deg, transparent, ${project.accentColor} 50%, transparent)`,
            opacity: isActive ? 0.9 : 0.45,
          }}
        />

        {/* Glowing right edge accent for stacked cards */}
        {!isActive && (
          <div
            className="pointer-events-none absolute top-0 bottom-0 right-0 w-24 rounded-r-2xl bg-gradient-to-l from-white/[0.06] via-transparent to-transparent"
          />
        )}

        {/* Card Content */}
        <div className="relative z-10 space-y-4">
          {/* Category & Status Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: project.accentColor }}
              />
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-300 font-semibold">
                {project.category}
              </span>
            </div>
            {getStatusBadge()}
          </div>

          {/* Title & Subtitle */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-medium text-white tracking-tight flex items-center gap-3">
              <span>{project.title}</span>
              {isActive && (
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/15">
                  #0{offset === 0 ? '1' : offset + 1}
                </span>
              )}
            </h3>
            <p className="text-xs font-mono text-zinc-300 mt-1">
              {project.subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed max-w-2xl">
            {project.description}
          </p>

          {/* Tech Stack Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-zinc-900/90 text-zinc-200 border border-zinc-700/80 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Expandable Architecture Highlights */}
          {showDetails && isActive && (
            <div className="pt-3 border-t border-zinc-800/80 space-y-1.5 transition-all">
              <span className="text-[11px] font-mono text-zinc-300 font-semibold block">
                Architecture & Implementation Highlights:
              </span>
              <ul className="space-y-1 text-xs text-zinc-300 font-mono">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">›</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Action Links & Specs Toggle */}
        <div className="relative z-10 pt-5 mt-4 border-t border-zinc-800/70 flex items-center justify-between flex-wrap gap-3">
          {isActive ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setShowDetails(!showDetails)
              }}
              className="text-xs font-mono text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer py-1"
            >
              <span>{showDetails ? 'hide specs' : 'inspect specs'}</span>
              <span className="text-emerald-400 font-bold">{showDetails ? '↑' : '↓'}</span>
            </button>
          ) : (
            <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
              <span>stacked in deck</span>
            </span>
          )}

          {isActive && (
            <div className="flex items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-200 hover:text-white transition-all px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-700/80 hover:border-zinc-500 hover:bg-zinc-800 shadow-md"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>repo</span>
                </a>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-emerald-100 border border-emerald-500/40 text-xs font-mono transition-all font-medium shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                >
                  <span>launch</span>
                  <span>↗</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProjectsShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PROJECTS.length)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = e.changedTouches[0].clientX - touchStartX.current
    if (diff < -35) {
      handleNext()
    }
    touchStartX.current = null
  }

  return (
    <section
      id="projects-section"
      className="w-full max-w-4xl mx-auto px-4 py-16 sm:py-24 select-none"
    >
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-medium text-white/90 tracking-tight">
          Actual Projects
        </h2>
      </div>

      {/* Stacked Cards Container (Cards layered and visibly offset to the right) */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full h-[480px] sm:h-[440px] mb-8"
      >
        {PROJECTS.map((project, index) => {
          const offset = (index - currentIndex + PROJECTS.length) % PROJECTS.length
          const isActive = offset === 0

          return (
            <ProjectCard
              key={project.id}
              project={project}
              isActive={isActive}
              offset={offset}
            />
          )
        })}
      </div>

      {/* Deck Controls (Right Arrow / Next Button & Indicators) */}
      <div className="flex items-center justify-between max-w-sm mx-auto px-2 pt-2">
        {/* Project dots and counter */}
        <div className="flex items-center gap-2">
          {PROJECTS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'w-7 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                  : 'w-2 bg-zinc-800'
              }`}
            />
          ))}
          <span className="text-xs font-mono text-zinc-300 ml-2 font-medium">
            0{currentIndex + 1} / 0{PROJECTS.length}
          </span>
        </div>

        {/* Next Card Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          className="group flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-zinc-900/95 hover:bg-zinc-800 border border-zinc-700/90 hover:border-emerald-500/60 text-xs font-mono text-zinc-100 hover:text-emerald-300 transition-all cursor-pointer shadow-xl ring-1 ring-white/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
          aria-label="Next project card"
        >
          <span>next project</span>
          <span className="text-emerald-400 transition-transform group-hover:translate-x-1 font-bold text-sm">→</span>
        </button>
      </div>
    </section>
  )
}
