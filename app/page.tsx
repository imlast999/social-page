'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

export interface SocialItem {
  id: string
  label: string
  href?: string
  isAction?: boolean
  ethAddress?: string
}

const SOCIAL_ITEMS: SocialItem[] = [
  {
    id: 'instagram',
    label: 'instagram',
    href: 'https://instagram.com/imlast999',
  },
  {
    id: 'twitter',
    label: 'twitter',
    href: 'https://twitter.com/imlast999',
  },
  {
    id: 'tiktok',
    label: 'tiktok',
    href: 'https://tiktok.com/@imlast999_',
  },
  {
    id: 'telegram',
    label: 'telegram',
    href: 'https://t.me/imlast999',
  },
  {
    id: 'twitch',
    label: 'twitch',
    href: 'https://twitch.tv/imlast999',
  },
  {
    id: 'spotify',
    label: 'spotify',
    href: 'https://open.spotify.com/user/31ezp7nbkqtopvtodymrdipbr22m',
  },
  {
    id: 'steam',
    label: 'steam',
    href: 'https://steamcommunity.com/id/imlast999',
  },
  {
    id: 'roblox',
    label: 'roblox',
    href: 'https://roblox.com/users/1193901121/profile',
  },
  {
    id: 'github',
    label: 'github',
    href: 'https://github.com/imlast999',
  },
  {
    id: 'ethereum',
    label: 'ethereum',
    isAction: true,
    ethAddress: '0x2232047f31888e6EAdC21d920E8FC4BD3ccDE13f',
  },
  {
    id: 'abstract',
    label: 'abstract',
    href: 'https://portal.abs.xyz/profile/0x73c83FD4803095f2da1D2b4C74D6332abbd100AD',
  },
  {
    id: 'fomo',
    label: 'fomo',
    href: 'https://fomo.family/r/imlast999',
  },
]

// Presets for scattering letters on hover
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

export default function SocialLinksMatrix() {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map())
  const [positions, setPositions] = useState<Record<string, ItemPos>>({})
  const [copiedEth, setCopiedEth] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Compute non-overlapping random positions
  const computeNonOverlappingPositions = useCallback(() => {
    if (!containerRef.current) return

    const W = containerRef.current.clientWidth || window.innerWidth
    const isMobile = W < 640
    const isTablet = W < 1024 && !isMobile

    const H = isMobile
      ? Math.max(window.innerHeight, 1200)
      : isTablet
      ? Math.max(window.innerHeight, 900)
      : Math.max(window.innerHeight, 750)

    const padX = isMobile ? 24 : 50
    const padY = isMobile ? 30 : 50
    const minGap = isMobile ? 20 : 40

    const availW = W - padX * 2
    const availH = H - padY * 2

    // Estimated fallback sizes if element not yet measured
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

    // 1. Freeform rejection sampling
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

    // 2. Disjoint jittered grid fallback
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

  // GSAP animation for position updates
  useEffect(() => {
    if (!mounted || Object.keys(positions).length === 0) return

    SOCIAL_ITEMS.forEach((item) => {
      const el = itemRefs.current.get(item.id)
      const pos = positions[item.id]
      if (el && pos) {
        gsap.to(el, {
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          duration: 0.8,
          ease: 'power3.out',
        })
      }
    })
  }, [positions, mounted])

  // Ethereum Copy Handler
  const handleCopyEthereum = () => {
    const ethAddress = '0x2232047f31888e6EAdC21d920E8FC4BD3ccDE13f'

    const triggerSuccess = () => {
      setCopiedEth(true)
      setToastMessage(`wallet ethereum copiada: ${ethAddress}`)

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

  // Hover scatter letters
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

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#08080c] overflow-hidden select-none"
      style={{
        minHeight:
          mounted && typeof window !== 'undefined' && window.innerWidth < 640
            ? '1200px'
            : '100vh',
      }}
    >
      {/* Links placed randomly with 0 overlaps */}
      {SOCIAL_ITEMS.map((item) => {
        const isEth = item.id === 'ethereum'
        const currentText = isEth && copiedEth ? 'copiado!' : item.label
        const letters = currentText.split('')

        const wordElement = (
          <span
            className={cn(
              'fancy-word inline-flex items-center text-4xl sm:text-5xl md:text-6xl font-medium lowercase tracking-normal transition-colors duration-250',
              isEth && copiedEth
                ? 'text-emerald-400'
                : 'text-white hover:text-zinc-300'
            )}
          >
            {letters.map((char, i) => (
              <span key={i} className="scatter-outer inline-block">
                <span className="scatter-inner inline-block">
                  <span className="inline-block">{char}</span>
                </span>
              </span>
            ))}
          </span>
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
              className="outline-none focus:outline-none cursor-pointer bg-transparent border-none p-0 m-0 text-left"
              aria-label="Copiar dirección ethereum"
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
            className="outline-none focus:outline-none no-underline block text-left"
            aria-label={item.label}
            {...commonProps}
          >
            {wordElement}
          </a>
        )
      })}

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
