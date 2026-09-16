'use client'

import React, { useState, useRef } from 'react'

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
}

const PROJECTS: Project[] = [
  {
    id: 'lastedge',
    title: 'LastEdge',
    subtitle: 'Quantitative Trading Platform for MetaTrader 5',
    category: 'Quantitative Systems / Algo Trading',
    status: 'live',
    statusText: 'ACTIVE REPOSITORY',
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
  onSelect,
}: {
  project: Project
  isActive: boolean
  offset: number
  onSelect: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [showDetails, setShowDetails] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isActive || !cardRef.current || !e.touches[0]) return
    const rect = cardRef.current.getBoundingClientRect()
    setCoords({
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    })
  }

  const getStatusBadge = () => {
    switch (project.status) {
      case 'live':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {project.statusText}
          </span>
        )
      case 'building':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            {project.statusText}
          </span>
        )
      case 'concept':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium tracking-wide bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            {project.statusText}
          </span>
        )
    }
  }

  // Calculate stack layer transformation
  // offset: 0 = active, 1 = first behind, 2 = second behind
  const translateY = offset * 26
  const scale = 1 - offset * 0.05
  const opacity = offset === 0 ? 1 : offset === 1 ? 0.72 : 0.45
  const zIndex = 30 - offset * 10

  return (
    <div
      ref={cardRef}
      onClick={() => {
        if (!isActive) onSelect()
      }}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      style={{
        transform: `translateY(${translateY}px) scale(${scale})`,
        zIndex,
        opacity,
        transformOrigin: 'top center',
      }}
      className={`absolute inset-x-0 top-0 rounded-2xl bg-[#09090e]/95 border transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] p-6 sm:p-8 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex flex-col justify-between overflow-hidden ${
        isActive
          ? 'border-zinc-700/90 hover:border-zinc-500/80 cursor-default pointer-events-auto'
          : 'border-zinc-800/60 hover:border-zinc-700/60 cursor-pointer pointer-events-auto select-none'
      }`}
    >
      {/* Spotlight Glow following cursor on active card */}
      {isActive && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(450px circle at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.06), transparent 80%)`,
          }}
        />
      )}

      {/* Card Content */}
      <div className="relative z-10 space-y-4">
        {/* Category & Status Bar */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
            {project.category}
          </span>
          {getStatusBadge()}
        </div>

        {/* Title & Subtitle */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
            {project.title}
          </h3>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            {project.subtitle}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl">
          {project.description}
        </p>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-zinc-900/90 text-zinc-400 border border-zinc-800/70"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Expandable Architecture Highlights */}
        {showDetails && isActive && (
          <div className="pt-3 border-t border-zinc-800/70 space-y-1.5 transition-all">
            <span className="text-[11px] font-mono text-zinc-400 font-semibold block">
              Core Highlights:
            </span>
            <ul className="space-y-1 text-xs text-zinc-400 font-mono">
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
      <div className="relative z-10 pt-6 mt-4 border-t border-zinc-800/60 flex items-center justify-between flex-wrap gap-3">
        {isActive ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setShowDetails(!showDetails)
            }}
            className="text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>{showDetails ? 'hide specs' : 'inspect specs'}</span>
            <span className="text-emerald-400">{showDetails ? '↑' : '↓'}</span>
          </button>
        ) : (
          <span className="text-xs font-mono text-zinc-500">tap to bring to front</span>
        )}

        {isActive && (
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700"
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 text-xs font-mono transition-all font-medium"
              >
                <span>launch</span>
                <span>↗</span>
              </a>
            )}
          </div>
        )}
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

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = e.changedTouches[0].clientX - touchStartX.current
    if (diff < -40) {
      handleNext()
    } else if (diff > 40) {
      handlePrev()
    }
    touchStartX.current = null
  }

  return (
    <section
      id="projects-section"
      className="w-full max-w-4xl mx-auto px-4 py-16 sm:py-24 select-none"
    >
      {/* Section Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>PORTFOLIO & CREATIONS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-tight">
          Holographic Deck
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto">
          Stacked project cards. Click next or swipe to loop infinitely through works.
        </p>
      </div>

      {/* Stacked Cards Container */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full h-[460px] sm:h-[420px] mb-8"
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
              onSelect={() => setCurrentIndex(index)}
            />
          )
        })}
      </div>

      {/* Deck Controls (Next Arrow / Prev / Counter) */}
      <div className="flex items-center justify-between max-w-md mx-auto px-2 pt-4">
        <button
          type="button"
          onClick={handlePrev}
          className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-white transition-all cursor-pointer"
          aria-label="Previous card"
        >
          <span className="text-emerald-400 transition-transform group-hover:-translate-x-0.5">←</span>
          <span>prev</span>
        </button>

        {/* Counter and project dots */}
        <div className="flex items-center gap-2">
          {PROJECTS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === currentIndex
                  ? 'w-6 bg-emerald-400'
                  : 'w-2 bg-zinc-800 hover:bg-zinc-600'
              }`}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
          <span className="text-xs font-mono text-zinc-500 ml-2">
            0{currentIndex + 1} / 0{PROJECTS.length}
          </span>
        </div>

        {/* Next Card Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 text-xs font-mono text-zinc-300 hover:text-emerald-300 transition-all cursor-pointer shadow-lg"
          aria-label="Next card"
        >
          <span>next</span>
          <span className="text-emerald-400 transition-transform group-hover:translate-x-0.5">→</span>
        </button>
      </div>
    </section>
  )
}
