'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type RoomId = 'airlock' | 'servers' | 'reactor' | 'vault' | 'bridge'

interface InventoryItem {
  id: string
  name: string
  type: string
  description: string
  spec: string
}

interface GuestbookEntry {
  id: string
  name: string
  message: string
  timestamp: string
}

/* Synthesized Web Audio API sound effects - Zero external files */
class SoundEngine {
  private ctx: AudioContext | null = null
  private muted: boolean = false

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  setMuted(m: boolean) {
    this.muted = m
  }

  playClick() {
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return
    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.03)
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.03)
    } catch {
      // AudioContext safe fallback
    }
  }

  playSuccess() {
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return
    try {
      const now = this.ctx.currentTime
      const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator()
        const gain = this.ctx!.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + idx * 0.07)
        gain.gain.setValueAtTime(0.09, now + idx * 0.07)
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.18)
        osc.connect(gain)
        gain.connect(this.ctx!.destination)
        osc.start(now + idx * 0.07)
        osc.stop(now + idx * 0.07 + 0.18)
      })
    } catch {
      // AudioContext safe fallback
    }
  }

  playError() {
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return
    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(140, this.ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.15)
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.15)
    } catch {
      // AudioContext safe fallback
    }
  }

  playPowerUp() {
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return
    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(90, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.4)
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.2)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.45)
    } catch {
      // AudioContext safe fallback
    }
  }
}

const sfx = new SoundEngine()

/* Bespoke Vector SVGs - Zero emojis */
const Icons = {
  Fuse: () => (
    <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12v4H6zM6 17h12v4H6z" />
      <path d="M9 7v10M15 7v10" />
      <path d="M12 10v4" />
    </svg>
  ),
  Slate: () => (
    <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="12" y2="14" />
      <circle cx="12" cy="18" r="1" />
    </svg>
  ),
  Keycard: () => (
    <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <line x1="7" y1="15" x2="7.01" y2="15" />
      <path d="M14 9h3v6h-3z" />
      <circle cx="7" cy="10" r="1.5" />
    </svg>
  ),
  Crystal: () => (
    <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 20 8 12 22 4 8 12 2" />
      <line x1="12" y1="2" x2="12" y2="22" />
    </svg>
  ),
  Terminal: () => (
    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
  Lock: () => (
    <svg className="w-3.5 h-3.5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Unlock: () => (
    <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Copy: () => (
    <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Back: () => (
    <svg className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  Speaker: ({ muted }: { muted: boolean }) => (
    <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      {muted ? (
        <line x1="23" y1="9" x2="17" y2="15" />
      ) : (
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
      )}
    </svg>
  ),
}

const TOTAL_HOTBAR_SLOTS = 6

export default function VoidAdventure() {
  const [currentRoom, setCurrentRoom] = useState<RoomId>('airlock')
  const [unlockedRooms, setUnlockedRooms] = useState<Record<RoomId, boolean>>({
    airlock: true,
    servers: false,
    reactor: false,
    vault: false,
    bridge: false,
  })

  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0)
  const [hoveredSlotIndex, setHoveredSlotIndex] = useState<number | null>(null)
  const [muted, setMuted] = useState(false)

  const [log, setLog] = useState<string[]>([
    '[INIT] Sector 999 telemetry online.',
    '[STATUS] Orbital void station entered. Atmospheric locks active.',
    '[OBJECTIVE] Adjust station levers & faders to route power across all sectors.',
  ])

  // --- CHAMBER 1: AIRLOCK LEVER SLIDER ---
  const [lockerOpened, setLockerOpened] = useState(false)
  const [valveAligned, setValveAligned] = useState(false)
  const [airlockPressure, setAirlockPressure] = useState(25) // Target is 100%

  // --- CHAMBER 2: DATA SERVERS FREQUENCY & PHASE SLIDERS ---
  const [freq, setFreq] = useState(360) // Target is 440 MHz
  const [phase, setPhase] = useState(20) // Target is 90 deg
  const [serversDecrypted, setServersDecrypted] = useState(false)
  const [extractedShardA, setExtractedShardA] = useState(false)

  // --- CHAMBER 3: REACTOR THERMAL & MAGNETIC FLUX FADERS ---
  const [plasmaTemp, setPlasmaTemp] = useState(240) // Target is 350 K
  const [magneticFlux, setMagneticFlux] = useState(45) // Target is 100 T
  const [coolantFlow, setCoolantFlow] = useState(30) // Target is 80 L/s
  const [reactorStabilized, setReactorStabilized] = useState(false)
  const [extractedKeycard, setExtractedKeycard] = useState(false)

  // --- CHAMBER 4: VAULT & CIPHER PROTOCOL ---
  const [keycardInserted, setKeycardInserted] = useState(false)
  const [cipherInput, setCipherInput] = useState('')
  const [cipherError, setCipherError] = useState(false)
  const [vaultDoorOpen, setVaultDoorOpen] = useState(false)

  // --- CHAMBER 5: APEX BRIDGE & REWARDS ---
  const [copiedKey, setCopiedKey] = useState(false)
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>([])
  const [guestName, setGuestName] = useState('')
  const [guestMsg, setGuestMsg] = useState('')
  const [submittedGuestbook, setSubmittedGuestbook] = useState(false)

  const logBottomRef = useRef<HTMLDivElement>(null)

  // Load persistent real transmissions
  useEffect(() => {
    const saved = localStorage.getItem('void_transmissions_v2')
    if (saved) {
      try {
        setGuestbook(JSON.parse(saved))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  useEffect(() => {
    if (logBottomRef.current) {
      logBottomRef.current.scrollTop = logBottomRef.current.scrollHeight
    }
  }, [log])

  // Keyboard shortcut listener for Minecraft hotbar keys (1-6)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing inside text inputs
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return
      }
      const num = parseInt(e.key, 10)
      if (!isNaN(num) && num >= 1 && num <= TOTAL_HOTBAR_SLOTS) {
        setSelectedSlotIndex(num - 1)
        sfx.playClick()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    sfx.setMuted(next)
  }

  const addLog = (tag: string, text: string) => {
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false })
    setLog((prev) => [...prev, `[${time}] [${tag}] ${text}`])
  }

  const hasItem = (id: string) => inventory.some((i) => i.id === id)

  const navigateTo = (room: RoomId) => {
    if (!unlockedRooms[room]) {
      sfx.playError()
      addLog('NAV_DENIED', `Access to Sector [${room.toUpperCase()}] is interlocked.`)
      return
    }
    sfx.playClick()
    setCurrentRoom(room)
    addLog('TRANSIT', `Operator relocated to Sector [${room.toUpperCase()}].`)
  }

  // --- CHAMBER 1 INTERACTIONS ---
  const handleInspectLocker = () => {
    sfx.playClick()
    if (lockerOpened) {
      addLog('SCAN', 'Auxiliary maintenance locker is empty.')
      return
    }
    setLockerOpened(true)
    const fuseItem: InventoryItem = {
      id: 'fuse',
      name: 'Superconductor Fuse',
      type: 'POWER_UNIT',
      description: 'Ultra-dense plasma conduit fuse for station substations.',
      spec: 'Continuous load: 1200V / 400A cryogenic relay.',
    }
    const slateItem: InventoryItem = {
      id: 'slate',
      name: 'Diagnostics Slate',
      type: 'DATA_PAD',
      description: 'Station engineering ledger showing calibration targets.',
      spec: 'Targets: Data carrier = 440MHz / 90° phase. Reactor core = 350K temp, 100T flux, 80L/s coolant.',
    }
    setInventory((prev) => [...prev, fuseItem, slateItem])
    sfx.playSuccess()
    addLog('ACQUIRE', 'Opened locker: Obtained [Superconductor Fuse] and [Diagnostics Slate].')
  }

  const handlePressureSlider = (val: number) => {
    setAirlockPressure(val)
    sfx.playClick()
    if (val === 100 && !valveAligned) {
      setValveAligned(true)
      setUnlockedRooms((prev) => ({ ...prev, servers: true }))
      sfx.playPowerUp()
      addLog('HYDRAULIC_OK', 'Atmospheric equalization reached 100%. Sector 02 [Data Core] unsealed!')
    }
  }

  // --- CHAMBER 2 INTERACTIONS ---
  const checkOscillator = (f: number, p: number) => {
    if (f === 440 && p === 90 && !serversDecrypted) {
      setServersDecrypted(true)
      setUnlockedRooms((prev) => ({ ...prev, reactor: true }))
      sfx.playSuccess()
      addLog('DECRYPTED', 'Carrier resonance locked at 440MHz / 90°. Quantum server banks initialized.')
      addLog('UNLOCKED', 'Reactor core access corridor unlocked!')
    }
  }

  const generateWavePath = (f: number, p: number) => {
    const points: string[] = []
    const cycles = (f / 100) * 1.5
    const phaseRad = (p * Math.PI) / 180
    for (let x = 0; x <= 400; x += 4) {
      const y = 35 + 24 * Math.sin(((x / 400) * cycles * 2 * Math.PI) + phaseRad)
      points.push(`${x},${y.toFixed(1)}`)
    }
    return `M ${points.join(' L ')}`
  }

  const targetWavePath = useMemo(() => generateWavePath(440, 90), [])
  const playerWavePath = useMemo(() => generateWavePath(freq, phase), [freq, phase])

  const handleExtractShardA = () => {
    sfx.playClick()
    if (!serversDecrypted) {
      sfx.playError()
      addLog('LOCKED', 'Mainframe encrypted. Align harmonic wave faders first.')
      return
    }
    if (extractedShardA) {
      addLog('EXHAUSTED', 'Memory bank shard already downloaded to buffer.')
      return
    }
    setExtractedShardA(true)
    const shardItem: InventoryItem = {
      id: 'shardA',
      name: 'Decryption Shard A',
      type: 'CIPHER_FRAGMENT',
      description: 'Extracted first half of master root cipher.',
      spec: 'Fragment payload: "VOID".',
    }
    setInventory((prev) => [...prev, shardItem])
    sfx.playSuccess()
    addLog('ACQUIRE', 'Downloaded [Decryption Shard A] payload: "VOID".')
  }

  // --- CHAMBER 3 INTERACTIONS ---
  const checkReactorEquilibrium = (temp: number, flux: number, coolant: number) => {
    if (temp === 350 && flux === 100 && coolant === 80 && !reactorStabilized) {
      setReactorStabilized(true)
      setUnlockedRooms((prev) => ({ ...prev, vault: true }))
      sfx.playPowerUp()
      addLog('THERMAL_OK', 'Plasma core equilibrium achieved (350K / 100T / 80L/s). Sector 04 [Security Vault] energized!')
    }
  }

  const handleExtractKeycard = () => {
    sfx.playClick()
    if (!reactorStabilized) {
      sfx.playError()
      addLog('HAZARD', 'Radiation containment active. Balance thermal & flux faders before extraction.')
      return
    }
    if (extractedKeycard) {
      addLog('EXHAUSTED', 'Root Keycard already taken from containment cradle.')
      return
    }
    setExtractedKeycard(true)
    const keycard: InventoryItem = {
      id: 'keycard',
      name: 'Root Keycard',
      type: 'SECURITY_TOKEN',
      description: 'Level-5 biometric security card for station blast door.',
      spec: 'Biometric authorization token for Sector 04 elevator lift.',
    }
    const shardB: InventoryItem = {
      id: 'shardB',
      name: 'Decryption Shard B',
      type: 'CIPHER_FRAGMENT',
      description: 'Recovered second half of master root cipher.',
      spec: 'Fragment payload: "999". Combined with Shard A reveals: "VOID999".',
    }
    setInventory((prev) => [...prev, keycard, shardB])
    sfx.playSuccess()
    addLog('ACQUIRE', 'Retrieved [Root Keycard] and [Decryption Shard B] payload: "999".')
  }

  // --- CHAMBER 4 INTERACTIONS ---
  const handleInsertKeycard = () => {
    sfx.playClick()
    if (!hasItem('keycard')) {
      sfx.playError()
      addLog('AUTH_FAIL', 'Cryptographic [Root Keycard] required to initialize terminal.')
      return
    }
    setKeycardInserted(true)
    sfx.playSuccess()
    addLog('KEYCARD_OK', 'Root Keycard verified. Dual-laser barrier disabled. Decryption console open.')
  }

  const handleSolveVaultCipher = (e: React.FormEvent) => {
    e.preventDefault()
    sfx.playClick()
    if (cipherInput.trim().toUpperCase() === 'VOID999') {
      setVaultDoorOpen(true)
      setUnlockedRooms((prev) => ({ ...prev, bridge: true }))
      sfx.playPowerUp()
      addLog('ACCESS_GRANTED', 'Master cipher verified (VOID + 999). Blast door disengaged. Sector 05 [Apex Bridge] unlocked!')
    } else {
      setCipherError(true)
      sfx.playError()
      addLog('CIPHER_DENIED', 'Cipher rejected. Combine Shard A ("VOID") and Shard B ("999") from inventory.')
      setTimeout(() => setCipherError(false), 2400)
    }
  }

  // --- CHAMBER 5: APEX BRIDGE INTERACTIONS ---
  const handleCopyMasterKey = () => {
    sfx.playClick()
    navigator.clipboard.writeText('VOID-ROOT-999')
    setCopiedKey(true)
    sfx.playSuccess()
    setTimeout(() => setCopiedKey(false), 2200)
  }

  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sfx.playClick()
    if (!guestName.trim() || !guestMsg.trim()) return
    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      name: guestName.trim(),
      message: guestMsg.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
    }
    const updated = [newEntry, ...guestbook]
    setGuestbook(updated)
    localStorage.setItem('void_transmissions_v2', JSON.stringify(updated))
    setSubmittedGuestbook(true)
    setGuestName('')
    setGuestMsg('')
    sfx.playSuccess()
    addLog('REGISTRY', `Transmission by ${newEntry.name} engraved in station non-volatile memory.`)
  }

  // Active Hotbar Item (hovered slot takes precedence, else selected slot)
  const activeSlotIndex = hoveredSlotIndex !== null ? hoveredSlotIndex : selectedSlotIndex
  const activeHotbarItem = inventory[activeSlotIndex] || null

  return (
    <main className="h-screen max-h-screen w-full bg-[#050508] text-zinc-100 select-none overflow-hidden flex flex-col font-mono antialiased relative">
      {/* Background Cyber Grid */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-cyber-grid opacity-20" />
      
      {/* Ambient Void Glows */}
      <div className="pointer-events-none fixed top-1/4 left-1/3 w-[400px] h-[400px] bg-purple-950/15 rounded-full blur-[140px]" />
      <div className="pointer-events-none fixed bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px]" />

      {/* ======================================================== */}
      {/* 1. COMPACT TOP HEADER                                    */}
      {/* ======================================================== */}
      <header className="h-12 border-b border-zinc-850 px-3 sm:px-6 flex items-center justify-between shrink-0 bg-[#07070a]/90 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <Icons.Back />
            <span className="hidden sm:inline">RETURN TO ORBIT</span>
          </Link>
          <span className="text-zinc-700 hidden sm:inline">/</span>
          <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SECTOR 999</span>
          </div>
        </div>

        {/* Chamber Deck Navigator */}
        <nav className="flex items-center gap-1">
          {[
            { id: 'airlock', name: '01: Airlock' },
            { id: 'servers', name: '02: Data' },
            { id: 'reactor', name: '03: Plasma' },
            { id: 'vault', name: '04: Vault' },
            { id: 'bridge', name: '05: Bridge' },
          ].map((room) => {
            const rId = room.id as RoomId
            const isCurrent = currentRoom === rId
            const isUnlocked = unlockedRooms[rId]

            return (
              <button
                key={room.id}
                type="button"
                onClick={() => navigateTo(rId)}
                disabled={!isUnlocked}
                className={`px-2.5 py-1 rounded text-[11px] transition-all flex items-center gap-1 border cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 font-bold shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                    : isUnlocked
                    ? 'bg-black/60 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
                    : 'bg-black/20 border-zinc-900 text-zinc-600 cursor-not-allowed'
                }`}
              >
                {isUnlocked ? <Icons.Unlock /> : <Icons.Lock />}
                <span>{room.name}</span>
              </button>
            )
          })}
        </nav>

        {/* Audio Mute & Telemetry Pill */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMute}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Toggle Audio Feedback"
          >
            <Icons.Speaker muted={muted} />
            <span className="text-[10px] hidden md:inline">{muted ? 'MUTED' : 'AUDIO'}</span>
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. MAIN GAME STAGE (ZERO PAGE SCROLL)                    */}
      {/* ======================================================== */}
      <div className="flex-1 min-h-0 p-3 sm:p-4 flex flex-col md:flex-row gap-3 overflow-hidden relative z-10">
        
        {/* Left / Center Workstation (Viewport + Sliders Controls) */}
        <section className="flex-1 min-w-0 flex flex-col gap-2.5 overflow-hidden">
          
          {/* Chamber Viewport Canvas */}
          <div className="flex-1 min-h-[180px] max-h-[46vh] rounded-xl overflow-hidden relative border border-zinc-800 bg-zinc-950 shadow-2xl group">
            {currentRoom === 'airlock' && (
              <Image
                src="/images/void_airlock.jpg"
                alt="Airlock Chamber"
                fill
                priority
                className="object-cover opacity-85 group-hover:opacity-95 transition-opacity duration-700"
                sizes="(max-width: 1024px) 100vw, 750px"
              />
            )}
            {currentRoom === 'servers' && (
              <Image
                src="/images/void_servers.jpg"
                alt="Quantum Data Core"
                fill
                priority
                className="object-cover opacity-85 group-hover:opacity-95 transition-opacity duration-700"
                sizes="(max-width: 1024px) 100vw, 750px"
              />
            )}
            {currentRoom === 'reactor' && (
              <Image
                src="/images/void_reactor.jpg"
                alt="Plasma Reactor Chamber"
                fill
                priority
                className="object-cover opacity-85 group-hover:opacity-95 transition-opacity duration-700"
                sizes="(max-width: 1024px) 100vw, 750px"
              />
            )}
            {currentRoom === 'vault' && (
              <Image
                src="/images/void_vault.jpg"
                alt="Security Vault"
                fill
                priority
                className="object-cover opacity-85 group-hover:opacity-95 transition-opacity duration-700"
                sizes="(max-width: 1024px) 100vw, 750px"
              />
            )}
            {currentRoom === 'bridge' && (
              <Image
                src="/images/void_bridge.jpg"
                alt="Observation Bridge"
                fill
                priority
                className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                sizes="(max-width: 1024px) 100vw, 750px"
              />
            )}

            {/* Scanlines Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />

            {/* Viewport Top Indicators */}
            <div className="pointer-events-none absolute top-2.5 left-3 text-[10px] text-zinc-400 font-mono">
              [FEED: SECTOR_{currentRoom.toUpperCase()}]
            </div>
            <div className="pointer-events-none absolute top-2.5 right-3 text-[10px] text-emerald-400 font-mono">
              {currentRoom === 'airlock' && (valveAligned ? 'PRESSURE EQUALIZED' : 'VACUUM CHAMBER')}
              {currentRoom === 'servers' && (serversDecrypted ? 'CARRIER 440MHz LOCKED' : 'NOISE DISTORTION')}
              {currentRoom === 'reactor' && (reactorStabilized ? 'CONTAINMENT EQUILIBRIUM' : 'UNSTABLE FLUX')}
              {currentRoom === 'vault' && (vaultDoorOpen ? 'BLAST DOOR OPEN' : 'SECURITY INTERLOCKED')}
              {currentRoom === 'bridge' && 'APEX STATION ORBIT'}
            </div>

            {/* HOTSPOTS ON VIEWPORT */}
            {currentRoom === 'airlock' && (
              <>
                <button
                  type="button"
                  onClick={handleInspectLocker}
                  className="absolute top-[48%] left-[16%] -translate-x-1/2 -translate-y-1/2 p-2 rounded-lg bg-black/80 hover:bg-black/95 border border-zinc-700 hover:border-emerald-400 transition-all cursor-pointer group/spot shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[11px] font-mono text-zinc-200 group-hover/spot:text-emerald-300">
                      {lockerOpened ? 'Locker [Empty]' : 'Maintenance Locker'}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('servers')}
                  disabled={!valveAligned}
                  className="absolute top-[45%] right-[10%] -translate-y-1/2 p-2.5 rounded-lg bg-black/85 hover:bg-black/95 border border-zinc-700 hover:border-emerald-400 transition-all cursor-pointer group/spot shadow-xl disabled:opacity-40"
                >
                  <div className="flex items-center gap-2">
                    {valveAligned ? <Icons.Unlock /> : <Icons.Lock />}
                    <span className={`text-[11px] font-mono ${valveAligned ? 'text-emerald-300 font-bold' : 'text-zinc-500'}`}>
                      {valveAligned ? 'Enter Sector 02 →' : 'Data Core [Sealed]'}
                    </span>
                  </div>
                </button>
              </>
            )}

            {currentRoom === 'servers' && serversDecrypted && (
              <button
                type="button"
                onClick={handleExtractShardA}
                className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 p-3 rounded-xl bg-black/90 border border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-center space-y-1 cursor-pointer group/shard"
              >
                <span className="text-[10px] text-cyan-400 font-bold block uppercase tracking-wider">
                  {extractedShardA ? 'Shard A Stored in Hotbar ✓' : 'Download Cipher Shard A ↵'}
                </span>
                <span className="text-xs text-zinc-200 block">
                  {extractedShardA ? 'Payload: "VOID"' : 'Click to save decrypted payload'}
                </span>
              </button>
            )}

            {currentRoom === 'reactor' && reactorStabilized && (
              <button
                type="button"
                onClick={handleExtractKeycard}
                className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 p-3 rounded-xl bg-black/90 border border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-center space-y-1 cursor-pointer group/card"
              >
                <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">
                  {extractedKeycard ? 'Security Tokens Stored in Hotbar ✓' : 'Extract Root Keycard & Shard B ↵'}
                </span>
                <span className="text-xs text-zinc-200 block">
                  {extractedKeycard ? 'Payload: "999" & Level-5 Keycard' : 'Click to retrieve items'}
                </span>
              </button>
            )}

            {currentRoom === 'vault' && (
              <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 p-3 rounded-xl bg-black/85 border border-zinc-700 max-w-xs text-center space-y-1 shadow-2xl">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                  Apex Access Bulkhead
                </span>
                <span className="text-xs text-emerald-400 font-bold block">
                  {vaultDoorOpen
                    ? 'Bulkhead Disengaged · Ready for Ascent'
                    : keycardInserted
                    ? 'Awaiting Master Combined Cipher'
                    : 'Requires Level-5 Root Keycard'}
                </span>
              </div>
            )}
          </div>

          {/* Tactical Workstation Sliders & Controls (Fixed Height / No Scroll) */}
          <div className="p-3.5 rounded-xl bg-[#09090e] border border-zinc-850 shrink-0 space-y-3 shadow-xl">
            
            {/* CHAMBER 01 CONTROLS */}
            {currentRoom === 'airlock' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs text-white uppercase tracking-wider font-semibold">
                      Chamber 01: Hydraulic Atmospheric Equalizer
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-sans">
                      Drag the hydraulic fader lever to 100% to decompress the passage to Sector 02.
                    </p>
                  </div>
                  <span className={`text-xs font-mono px-2.5 py-0.5 rounded border font-bold ${
                    airlockPressure === 100
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                      : 'bg-zinc-900 text-amber-400 border-zinc-800'
                  }`}>
                    {airlockPressure}% / 100%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={airlockPressure}
                    disabled={valveAligned}
                    onChange={(e) => handlePressureSlider(Number(e.target.value))}
                    className="cyber-slider flex-1"
                  />
                  {!lockerOpened && (
                    <button
                      type="button"
                      onClick={handleInspectLocker}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-xs text-zinc-200 transition-all cursor-pointer whitespace-nowrap"
                    >
                      Unlatch Locker
                    </button>
                  )}
                  {valveAligned && (
                    <button
                      type="button"
                      onClick={() => navigateTo('servers')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                    >
                      Enter Sector 02 →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* CHAMBER 02 CONTROLS */}
            {currentRoom === 'servers' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs text-white uppercase tracking-wider font-semibold">
                      Chamber 02: Carrier Oscilloscope Calibration
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-sans">
                      Match target wave (Diagnostics Slate clue: 440MHz / 90° Phase).
                    </p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${serversDecrypted ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-amber-950/60 text-amber-400 border border-amber-800'}`}>
                    {serversDecrypted ? 'SYNCHRONIZED' : 'SEEKING'}
                  </span>
                </div>

                {/* Oscilloscope Mini Waveform */}
                <div className="h-16 rounded-lg bg-black/90 border border-zinc-800 p-1 overflow-hidden relative flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 400 70" preserveAspectRatio="none">
                    <line x1="0" y1="35" x2="400" y2="35" stroke="#27272a" strokeDasharray="3 3" />
                    <path d={targetWavePath} fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-40" />
                    <path d={playerWavePath} fill="none" stroke={serversDecrypted ? '#10b981' : '#c084fc'} strokeWidth="2" />
                  </svg>
                  <div className="absolute bottom-1 right-2 text-[9px] text-zinc-500 font-mono">
                    {freq}MHz / {phase}°
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">Frequency:</span>
                      <span className={freq === 440 ? 'text-emerald-400 font-bold' : 'text-cyan-400'}>{freq} MHz</span>
                    </div>
                    <input
                      type="range"
                      min="300"
                      max="600"
                      step="5"
                      value={freq}
                      disabled={serversDecrypted}
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        setFreq(val)
                        sfx.playClick()
                        checkOscillator(val, phase)
                      }}
                      className="cyber-slider"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">Phase Angle:</span>
                      <span className={phase === 90 ? 'text-emerald-400 font-bold' : 'text-purple-400'}>{phase}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="180"
                      step="5"
                      value={phase}
                      disabled={serversDecrypted}
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        setPhase(val)
                        sfx.playClick()
                        checkOscillator(freq, val)
                      }}
                      className="cyber-slider"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CHAMBER 03 CONTROLS */}
            {currentRoom === 'reactor' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs text-white uppercase tracking-wider font-semibold">
                      Chamber 03: Plasma Thermal & Flux Faders
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-sans">
                      Align core parameters (Slate clue: 350K Temp / 100T Flux / 80L/s Coolant).
                    </p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${reactorStabilized ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950/60 text-amber-400 border border-amber-800'}`}>
                    {reactorStabilized ? 'STABILIZED' : 'UNBALANCED'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Temp */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">Temperature:</span>
                      <span className={plasmaTemp === 350 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>{plasmaTemp} K</span>
                    </div>
                    <input
                      type="range"
                      min="150"
                      max="550"
                      step="5"
                      value={plasmaTemp}
                      disabled={reactorStabilized}
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        setPlasmaTemp(val)
                        sfx.playClick()
                        checkReactorEquilibrium(val, magneticFlux, coolantFlow)
                      }}
                      className="cyber-slider"
                    />
                  </div>

                  {/* Flux */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">Mag Confinement:</span>
                      <span className={magneticFlux === 100 ? 'text-emerald-400 font-bold' : 'text-cyan-400'}>{magneticFlux} T</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="180"
                      step="5"
                      value={magneticFlux}
                      disabled={reactorStabilized}
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        setMagneticFlux(val)
                        sfx.playClick()
                        checkReactorEquilibrium(plasmaTemp, val, coolantFlow)
                      }}
                      className="cyber-slider"
                    />
                  </div>

                  {/* Coolant */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">Coolant Flow:</span>
                      <span className={coolantFlow === 80 ? 'text-emerald-400 font-bold' : 'text-purple-400'}>{coolantFlow} L/s</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="160"
                      step="5"
                      value={coolantFlow}
                      disabled={reactorStabilized}
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        setCoolantFlow(val)
                        sfx.playClick()
                        checkReactorEquilibrium(plasmaTemp, magneticFlux, val)
                      }}
                      className="cyber-slider"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CHAMBER 04 CONTROLS */}
            {currentRoom === 'vault' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div className="space-y-1">
                  <span className="text-xs text-zinc-300 font-semibold uppercase block">Level-5 Keycard Interlock</span>
                  <p className="text-[11px] text-zinc-400 font-sans">
                    {keycardInserted ? 'Laser barrier bypassed.' : 'Validate Root Keycard to enable cipher mainframe.'}
                  </p>
                  {!keycardInserted && (
                    <button
                      type="button"
                      onClick={handleInsertKeycard}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-xs text-zinc-200 transition-all cursor-pointer"
                    >
                      Insert Root Keycard
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs text-zinc-300 font-semibold uppercase block">Combined Shards Decryption</span>
                  {keycardInserted ? (
                    <form onSubmit={handleSolveVaultCipher} className="flex gap-2">
                      <input
                        type="text"
                        value={cipherInput}
                        onChange={(e) => setCipherInput(e.target.value)}
                        placeholder="ENTER COMBINED CIPHER..."
                        className="flex-1 px-3 py-1.5 rounded-lg bg-black/90 border border-zinc-800 focus:border-emerald-500 text-emerald-400 text-xs font-mono outline-none uppercase"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-mono transition-all cursor-pointer"
                      >
                        Unlock
                      </button>
                    </form>
                  ) : (
                    <p className="text-[11px] text-zinc-500 font-mono">Requires Keycard authentication first.</p>
                  )}
                  {cipherError && (
                    <p className="text-[10px] text-red-400 font-mono">Error: Combine Shard A ("VOID") & Shard B ("999").</p>
                  )}
                </div>
              </div>
            )}

            {/* CHAMBER 05 CONTROLS */}
            {currentRoom === 'bridge' && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">
                    Privilege A: Root Terminal Sudo Token
                  </span>
                  <p className="text-[11px] text-zinc-400 font-sans">
                    Execute <span className="text-emerald-400 font-mono font-bold">sudo VOID-ROOT-999</span> in the landing terminal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyMasterKey}
                  className="px-4 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>{copiedKey ? 'Token Copied!' : 'Copy VOID-ROOT-999'}</span>
                  {copiedKey ? <Icons.Check /> : <Icons.Copy />}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Right Telemetry Log & Station Mission Drawer (Fixed Height / Internal Scroll) */}
        <aside className="w-full md:w-72 lg:w-80 shrink-0 flex flex-col gap-2.5 overflow-hidden">
          
          {/* Mission Objective Briefing */}
          <div className="p-3 rounded-xl bg-[#09090e] border border-zinc-850 shrink-0 space-y-1.5 shadow-lg">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="uppercase tracking-wider font-semibold">Active Sector Objective</span>
              <span className="text-[10px] text-emerald-400 font-mono">DECK_0{currentRoom === 'airlock' ? '1' : currentRoom === 'servers' ? '2' : currentRoom === 'reactor' ? '3' : currentRoom === 'vault' ? '4' : '5'}</span>
            </div>
            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              {currentRoom === 'airlock' && 'Equalize airlock pressure to 100% and inspect the maintenance locker.'}
              {currentRoom === 'servers' && 'Calibrate carrier frequency to 440MHz & 90° to download Shard A ("VOID").'}
              {currentRoom === 'reactor' && 'Balance thermal temperature (350K), flux (100T), and coolant (80L/s) to obtain Root Keycard & Shard B.'}
              {currentRoom === 'vault' && 'Validate Root Keycard to bypass lasers, then combine Shards to unlock bridge.'}
              {currentRoom === 'bridge' && 'Operator Bridge unlocked. Claim master sudo token and engrave transmission.'}
            </p>
          </div>

          {/* Activity Console Log (Only area that scrolls internally) */}
          <div className="flex-1 min-h-0 bg-[#09090e] border border-zinc-850 rounded-xl p-3 flex flex-col justify-between overflow-hidden shadow-lg">
            <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-850/60">
              <span className="uppercase tracking-wider font-semibold">Station Telemetry Stream</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div
              ref={logBottomRef}
              className="flex-1 overflow-y-auto space-y-1.5 font-mono text-[11px] text-zinc-400 py-2"
            >
              {log.map((entry, i) => (
                <div key={i} className="leading-relaxed">
                  <span className="text-emerald-400/80">{entry.slice(0, 10)}</span>
                  <span>{entry.slice(10)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-850/60 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
              <span>BUFFER: STABLE</span>
              <span>SLOTS: {inventory.length} / {TOTAL_HOTBAR_SLOTS}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* ======================================================== */}
      {/* 3. MINECRAFT-STYLE BOTTOM INVENTORY HOTBAR DOCK          */}
      {/* ======================================================== */}
      <footer className="h-16 border-t border-zinc-850 bg-[#07070a]/95 backdrop-blur-md px-4 flex items-center justify-center shrink-0 relative z-20 shadow-[0_-4px_25px_rgba(0,0,0,0.7)]">
        
        {/* Floating Tooltip displaying current active item details */}
        {activeHotbarItem && (
          <div className="absolute -top-11 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-zinc-900/95 border border-zinc-700 shadow-2xl backdrop-blur-md flex items-center gap-2 pointer-events-none whitespace-nowrap animate-fadeIn">
            <span className="text-xs font-bold text-emerald-400 font-mono">{activeHotbarItem.name}</span>
            <span className="text-[10px] text-zinc-500 font-mono">[{activeHotbarItem.type}]</span>
            <span className="text-[11px] text-zinc-300 font-sans hidden sm:inline">· {activeHotbarItem.spec}</span>
          </div>
        )}

        {/* 6-Slot Minecraft Hotbar */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/90 border border-zinc-800 shadow-inner">
          {Array.from({ length: TOTAL_HOTBAR_SLOTS }).map((_, idx) => {
            const item = inventory[idx] || null
            const isSelected = selectedSlotIndex === idx

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedSlotIndex(idx)
                  sfx.playClick()
                }}
                onMouseEnter={() => setHoveredSlotIndex(idx)}
                onMouseLeave={() => setHoveredSlotIndex(null)}
                className={`w-12 h-12 rounded-lg flex items-center justify-center relative transition-all cursor-pointer ${
                  isSelected
                    ? 'border-2 border-emerald-400 bg-emerald-950/40 shadow-[0_0_12px_rgba(16,185,129,0.45)] scale-105 z-10'
                    : 'border border-zinc-800 bg-zinc-900/60 hover:border-zinc-600 hover:bg-zinc-850'
                }`}
                title={item ? `${item.name} (${item.spec})` : `Slot ${idx + 1} (Empty)`}
              >
                {/* Hotbar Slot Number Indicator in Top-Left Corner (1-6) */}
                <span className="absolute top-0.5 left-1 text-[9px] text-zinc-500 font-mono select-none">
                  {idx + 1}
                </span>

                {/* Rendered Bespoke Vector Icon */}
                {item ? (
                  <div className="p-1">
                    {item.id === 'fuse' && <Icons.Fuse />}
                    {item.id === 'slate' && <Icons.Slate />}
                    {item.id === 'shardA' && <Icons.Crystal />}
                    {item.id === 'keycard' && <Icons.Keycard />}
                    {item.id === 'shardB' && <Icons.Crystal />}
                  </div>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-zinc-800/40" />
                )}
              </button>
            )
          })}
        </div>
      </footer>
    </main>
  )
}
