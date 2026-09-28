'use client'

import React, { useState, useEffect, useRef } from 'react'
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

/* Synthesized Web Audio API sound effects - No external audio files */
class SoundEngine {
  private ctx: AudioContext | null = null
  private muted: boolean = false

  constructor() {
    // Initialized on first user interaction
  }

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

  isMuted() {
    return this.muted
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
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime)
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
  Torch: () => (
    <svg className="w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="2" x2="22" y2="6" />
      <path d="m7.5 4.2 9 9-4.2 4.2-9-9Z" />
      <path d="m2 22 5-5" />
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
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [muted, setMuted] = useState(false)

  const [log, setLog] = useState<string[]>([
    '[INIT] Sector 999 telemetry online.',
    '[STATUS] Orbital void station entered. Atmospheric locks active.',
    '[OBJECTIVE] Restore auxiliary grid and access internal sectors.',
  ])

  // --- CHAMBER 1: AIRLOCK STATE ---
  const [lockerOpened, setLockerOpened] = useState(false)
  const [valveAligned, setValveAligned] = useState(false)
  const [airlockPressure, setAirlockPressure] = useState(30) // Target is 100

  // --- CHAMBER 2: DATA SERVERS & OSCILLOSCOPE FREQUENCY PUZZLE ---
  const [freq, setFreq] = useState(380) // Target is 440 MHz
  const [phase, setPhase] = useState(30) // Target is 90 deg
  const [serversDecrypted, setServersDecrypted] = useState(false)
  const [extractedShardA, setExtractedShardA] = useState(false)

  // --- CHAMBER 3: REACTOR & 4-COIL PLASMA FLUX BALANCER ---
  // Target: all 4 coils must reach exactly 100MW (total 400MW)
  const [coils, setCoils] = useState<[number, number, number, number]>([60, 140, 80, 120])
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
      description: 'Station operational ledger showing sector frequencies.',
      spec: 'Notation: Data Core carrier tuned to 440MHz @ 90° phase.',
    }
    setInventory((prev) => [...prev, fuseItem, slateItem])
    sfx.playSuccess()
    addLog('ACQUIRE', 'Opened locker: Obtained [Superconductor Fuse] and [Diagnostics Slate].')
  }

  const handleAdjustPressure = (delta: number) => {
    sfx.playClick()
    const nextVal = Math.min(100, Math.max(0, airlockPressure + delta))
    setAirlockPressure(nextVal)
    if (nextVal === 100 && !valveAligned) {
      setValveAligned(true)
      setUnlockedRooms((prev) => ({ ...prev, servers: true }))
      sfx.playPowerUp()
      addLog('HYDRAULIC_OK', 'Atmospheric equalization reached 100%. Sector 02 [Data Core] unsealed!')
    }
  }

  // --- CHAMBER 2 INTERACTIONS (OSCILLOSCOPE HARMONICS) ---
  const handleAdjustFreq = (delta: number) => {
    sfx.playClick()
    const next = Math.max(300, Math.min(600, freq + delta))
    setFreq(next)
    checkOscillator(next, phase)
  }

  const handleAdjustPhase = (delta: number) => {
    sfx.playClick()
    const next = Math.max(0, Math.min(180, phase + delta))
    setPhase(next)
    checkOscillator(freq, next)
  }

  const checkOscillator = (f: number, p: number) => {
    if (f === 440 && p === 90 && !serversDecrypted) {
      setServersDecrypted(true)
      setUnlockedRooms((prev) => ({ ...prev, reactor: true }))
      sfx.playSuccess()
      addLog('DECRYPTED', 'Signal resonance locked at 440MHz / 90°. Server banks initialized.')
      addLog('UNLOCKED', 'Reactor core access corridor unlocked!')
    }
  }

  const handleExtractShardA = () => {
    sfx.playClick()
    if (!serversDecrypted) {
      sfx.playError()
      addLog('LOCKED', 'Mainframe encrypted. Align harmonic wave first.')
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

  // --- CHAMBER 3 INTERACTIONS (PLASMA COIL BALANCER) ---
  const handleShiftFlux = (index: number) => {
    sfx.playClick()
    if (reactorStabilized) {
      addLog('STABLE', 'Plasma core is already locked in harmonic equilibrium.')
      return
    }

    setCoils((prev) => {
      const next: [number, number, number, number] = [...prev]
      if (index === 0) {
        // Coil Alpha (+20 Alpha, -20 Beta)
        next[0] = Math.min(160, next[0] + 20)
        next[1] = Math.max(40, next[1] - 20)
      } else if (index === 1) {
        // Coil Beta (+20 Beta, -20 Gamma)
        next[1] = Math.min(160, next[1] + 20)
        next[2] = Math.max(40, next[2] - 20)
      } else if (index === 2) {
        // Coil Gamma (+20 Gamma, -20 Delta)
        next[2] = Math.min(160, next[2] + 20)
        next[3] = Math.max(40, next[3] - 20)
      } else {
        // Coil Delta (+20 Delta, -20 Alpha)
        next[3] = Math.min(160, next[3] + 20)
        next[0] = Math.max(40, next[0] - 20)
      }

      // Check if all four are exactly 100MW
      if (next[0] === 100 && next[1] === 100 && next[2] === 100 && next[3] === 100) {
        setReactorStabilized(true)
        setUnlockedRooms((p) => ({ ...p, vault: true }))
        sfx.playPowerUp()
        addLog('REACTOR_100', 'Plasma magnetic equilibrium achieved (100-100-100-100MW). Sector 04 [Security Vault] energized!')
      }
      return next
    })
  }

  const handleResetCoils = () => {
    sfx.playClick()
    setCoils([60, 140, 80, 120])
    addLog('RESET', 'Plasma magnetic coils re-initialized to default baseline.')
  }

  const handleExtractKeycard = () => {
    sfx.playClick()
    if (!reactorStabilized) {
      sfx.playError()
      addLog('HAZARD', 'Radiation containment active. Balance plasma coils before manual extraction.')
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

  // --- CHAMBER 4 INTERACTIONS (VAULT BULKHEAD) ---
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
      addLog('CIPHER_DENIED', 'Cipher rejected. Combine Shard A ("VOID") from Sector 02 and Shard B ("999") from Sector 03.')
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

  return (
    <main className="min-h-screen w-full bg-[#050508] text-zinc-100 select-none relative overflow-x-hidden font-mono antialiased pb-20">
      {/* Background Cyber Grid */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-cyber-grid opacity-20" />
      
      {/* Ambient Lighting */}
      <div className="pointer-events-none fixed top-1/4 left-1/3 w-[500px] h-[500px] bg-purple-950/15 rounded-full blur-[160px]" />
      <div className="pointer-events-none fixed bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        
        {/* Navigation & Telemetry Header */}
        <header className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <Link
            href="/"
            className="group flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <Icons.Back />
            <span>RETURN TO ORBIT</span>
          </Link>

          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={toggleMute}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Toggle Synthesized Audio"
            >
              <Icons.Speaker muted={muted} />
              <span className="text-[10px]">{muted ? 'MUTED' : 'AUDIO ON'}</span>
            </button>

            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ORBITAL STATION 999</span>
            </div>
          </div>
        </header>

        {/* Tactical Station Minimap & Chamber Selector */}
        <nav className="p-3 rounded-xl bg-[#09090e] border border-zinc-850 flex items-center justify-between flex-wrap gap-2">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">
            Station Deck:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'airlock', name: '01: Airlock' },
              { id: 'servers', name: '02: Data Core' },
              { id: 'reactor', name: '03: Plasma Core' },
              { id: 'vault', name: '04: Security Vault' },
              { id: 'bridge', name: '05: Apex Bridge' },
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
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 border cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : isUnlocked
                      ? 'bg-black/60 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
                      : 'bg-black/30 border-zinc-900 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  {isUnlocked ? <Icons.Unlock /> : <Icons.Lock />}
                  <span>{room.name}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* ======================================================== */}
        {/* CHAMBER 01: MAINTENANCE AIRLOCK                         */}
        {/* ======================================================== */}
        {currentRoom === 'airlock' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-[10px] tracking-widest text-emerald-400 font-bold uppercase">
                  Deck 01 Entry Point
                </span>
                <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-white uppercase mt-0.5">
                  Chamber 01: Maintenance Airlock
                </h1>
              </div>
              <div className="text-right text-[11px] text-zinc-400">
                HYDRAULIC EQUALIZATION: {airlockPressure}%
              </div>
            </div>

            {/* Interactive Viewport Canvas */}
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-[16/9] max-h-[460px] shadow-2xl group">
              <Image
                src="/images/void_airlock.jpg"
                alt="Airlock Chamber"
                fill
                priority
                className="object-cover opacity-85 group-hover:opacity-95 transition-opacity duration-700"
                sizes="(max-width: 1024px) 100vw, 980px"
              />
              
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />

              <div className="pointer-events-none absolute top-3 left-4 text-[10px] text-zinc-400 font-mono">
                [CAM_01: AIRLOCK_SUBDECK]
              </div>
              <div className="pointer-events-none absolute top-3 right-4 text-[10px] text-emerald-400 font-mono">
                VALVE EQUALIZER: {valveAligned ? 'SECTOR 02 UNLOCKED' : 'INTERLOCKED'}
              </div>

              {/* HOTSPOT 1: Maintenance Locker */}
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

              {/* HOTSPOT 2: Hydraulic Valve Equalizer */}
              <div className="absolute top-[68%] left-[50%] -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-black/85 border border-zinc-700 max-w-xs text-center space-y-2 shadow-2xl">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                  Atmospheric Equalizer ({airlockPressure}/100%)
                </span>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAdjustPressure(-10)}
                    disabled={valveAligned || airlockPressure <= 0}
                    className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] border border-zinc-800 cursor-pointer disabled:opacity-40"
                  >
                    -10%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustPressure(10)}
                    disabled={valveAligned || airlockPressure >= 100}
                    className="px-2.5 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-[10px] cursor-pointer disabled:opacity-40"
                  >
                    +10% Equalize
                  </button>
                </div>
              </div>

              {/* HOTSPOT 3: Passage to Sector 02 */}
              <button
                type="button"
                onClick={() => navigateTo('servers')}
                disabled={!valveAligned}
                className="absolute top-[45%] right-[10%] -translate-y-1/2 p-2.5 rounded-lg bg-black/85 hover:bg-black/95 border border-zinc-700 hover:border-emerald-400 transition-all cursor-pointer group/spot shadow-xl disabled:opacity-40"
              >
                <div className="flex items-center gap-2">
                  {valveAligned ? <Icons.Unlock /> : <Icons.Lock />}
                  <span className={`text-[11px] font-mono ${valveAligned ? 'text-emerald-300 font-bold' : 'text-zinc-500'}`}>
                    {valveAligned ? 'Sector 02: Data Core →' : 'Data Core [Sealed]'}
                  </span>
                </div>
              </button>
            </div>

            {/* Tactical Control Modules Below Viewport */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={handleInspectLocker}
                className="p-4 rounded-xl bg-[#09090e] border border-zinc-800 hover:border-zinc-700 transition-all text-left space-y-2 cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">OBJECT 01</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${lockerOpened ? 'bg-zinc-900 text-zinc-500' : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'}`}>
                    {lockerOpened ? 'EXTRACTED' : 'INTERACT'}
                  </span>
                </div>
                <div className="text-sm text-zinc-200 group-hover:text-emerald-400 transition-colors">
                  Maintenance Locker
                </div>
                <p className="text-[11px] text-zinc-400">
                  {lockerOpened ? 'Equipment stored in inventory.' : 'Scan auxiliary compartment.'}
                </p>
              </button>

              <div className="p-4 rounded-xl bg-[#09090e] border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">PUZZLE 01</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${valveAligned ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-amber-950/60 text-amber-400 border border-amber-800'}`}>
                    {valveAligned ? 'EQUALIZED' : 'INCOMPLETE'}
                  </span>
                </div>
                <div className="text-sm text-zinc-200">
                  Atmospheric Equalizer
                </div>
                <p className="text-[11px] text-zinc-400">
                  Equalize pressure to 100% to uncouple the hydraulic corridor bulkhead.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigateTo('servers')}
                disabled={!valveAligned}
                className="p-4 rounded-xl bg-[#09090e] border border-zinc-800 hover:border-zinc-700 transition-all text-left space-y-2 cursor-pointer group disabled:opacity-40"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">PASSAGE</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${valveAligned ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-zinc-900 text-zinc-500'}`}>
                    {valveAligned ? 'OPEN' : 'LOCKED'}
                  </span>
                </div>
                <div className="text-sm text-zinc-200 group-hover:text-emerald-400 transition-colors">
                  Corridor to Data Core
                </div>
                <p className="text-[11px] text-zinc-400">
                  Proceed to server archives upon pressure equalization.
                </p>
              </button>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* CHAMBER 02: SEVERED DATA CORE & OSCILLOSCOPE PUZZLE     */}
        {/* ======================================================== */}
        {currentRoom === 'servers' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-[10px] tracking-widest text-cyan-400 font-bold uppercase">
                  Deck 02 Server Bank
                </span>
                <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-white uppercase mt-0.5">
                  Chamber 02: Quantum Data Core
                </h1>
              </div>
              <div className="text-right text-[11px] text-zinc-400">
                HARMONIC LOCK: {serversDecrypted ? 'ONLINE (440MHz / 90°)' : 'DESYNCHRONIZED'}
              </div>
            </div>

            {/* Viewport for Server Chamber */}
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-[16/9] max-h-[460px] shadow-2xl group">
              <Image
                src="/images/void_servers.jpg"
                alt="Quantum Data Core"
                fill
                priority
                className="object-cover opacity-85 group-hover:opacity-95 transition-opacity duration-700"
                sizes="(max-width: 1024px) 100vw, 980px"
              />

              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />

              <div className="pointer-events-none absolute top-3 left-4 text-[10px] text-zinc-400 font-mono">
                [CAM_02: QUANTUM_SERVER_VAULT]
              </div>
              <div className="pointer-events-none absolute top-3 right-4 text-[10px] text-cyan-400 font-mono">
                SIGNAL: {serversDecrypted ? 'CARRIER RESTORED' : 'NOISE DISTORTION'}
              </div>

              {/* Shard Download Terminal Hotspot */}
              {serversDecrypted && (
                <button
                  type="button"
                  onClick={handleExtractShardA}
                  className="absolute top-[52%] left-[50%] -translate-x-1/2 -translate-y-1/2 p-3 rounded-xl bg-black/90 border border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-center space-y-1 cursor-pointer group/shard"
                >
                  <span className="text-[10px] text-cyan-400 font-bold block uppercase tracking-wider">
                    {extractedShardA ? 'Shard A Downloaded ✓' : 'Download Cipher Shard A ↵'}
                  </span>
                  <span className="text-xs text-zinc-200 block">
                    {extractedShardA ? 'Buffer stored: "VOID"' : 'Click to save decrypted payload'}
                  </span>
                </button>
              )}
            </div>

            {/* Oscilloscope Frequency Tuning Puzzle Console */}
            <div className="p-6 rounded-2xl bg-[#09090e] border border-zinc-800 space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Icons.Slate />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                      Carrier Frequency Calibration Console
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 font-sans">
                    Match the wave parameters found on the Maintenance Slate (Target: 440MHz / 90° Phase).
                  </p>
                </div>

                <span className={`text-[10px] px-2.5 py-1 rounded font-mono ${serversDecrypted ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-amber-950/60 text-amber-400 border border-amber-800'}`}>
                  {serversDecrypted ? 'HARMONIC ALIGNED' : 'SEEKING FREQUENCY'}
                </span>
              </div>

              {/* Visual Wave Simulation Bar */}
              <div className="p-4 rounded-xl bg-black/80 border border-zinc-850 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>FREQUENCY: <span className="text-cyan-400 font-bold">{freq} MHz</span> (Target: 440 MHz)</span>
                  <span>PHASE: <span className="text-purple-400 font-bold">{phase}°</span> (Target: 90°)</span>
                </div>

                {/* Progress bar visualizing harmonic proximity */}
                <div className="w-full h-3 rounded-full bg-zinc-900 overflow-hidden flex items-center p-0.5 border border-zinc-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                    style={{
                      width: `${Math.max(5, 100 - (Math.abs(freq - 440) + Math.abs(phase - 90)))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Tuning Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-850 space-y-2">
                  <span className="text-[11px] text-zinc-400 block font-semibold">Frequency Stepper (MHz):</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAdjustFreq(-20)}
                      disabled={serversDecrypted}
                      className="flex-1 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-xs border border-zinc-800 cursor-pointer disabled:opacity-40"
                    >
                      -20 MHz
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAdjustFreq(20)}
                      disabled={serversDecrypted}
                      className="flex-1 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-xs border border-zinc-800 cursor-pointer disabled:opacity-40"
                    >
                      +20 MHz
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-850 space-y-2">
                  <span className="text-[11px] text-zinc-400 block font-semibold">Phase Shift (°):</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAdjustPhase(-15)}
                      disabled={serversDecrypted}
                      className="flex-1 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-xs border border-zinc-800 cursor-pointer disabled:opacity-40"
                    >
                      -15°
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAdjustPhase(15)}
                      disabled={serversDecrypted}
                      className="flex-1 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-xs border border-zinc-800 cursor-pointer disabled:opacity-40"
                    >
                      +15°
                    </button>
                  </div>
                </div>
              </div>

              {/* Next Navigation */}
              <div className="pt-3 border-t border-zinc-850 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => navigateTo('airlock')}
                  className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>←</span>
                  <span>Return to Sector 01: Airlock</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('reactor')}
                  disabled={!serversDecrypted}
                  className="px-4 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs transition-all cursor-pointer disabled:opacity-40"
                >
                  Proceed to Sector 03: Plasma Core →
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* CHAMBER 03: PLASMA CORE & 4-COIL EQUILIBRIUM PUZZLE      */}
        {/* ======================================================== */}
        {currentRoom === 'reactor' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-[10px] tracking-widest text-emerald-400 font-bold uppercase">
                  Deck 03 High Voltage
                </span>
                <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-white uppercase mt-0.5">
                  Chamber 03: Plasma Core
                </h1>
              </div>
              <div className="text-right text-[11px] text-zinc-400">
                CONTAINMENT STATUS: {reactorStabilized ? 'LOCKED EQUILIBRIUM' : 'UNBALANCED FLUX'}
              </div>
            </div>

            {/* Viewport for Reactor */}
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-[16/9] max-h-[460px] shadow-2xl group">
              <Image
                src="/images/void_reactor.jpg"
                alt="Plasma Reactor Chamber"
                fill
                priority
                className="object-cover opacity-85 group-hover:opacity-95 transition-opacity duration-700"
                sizes="(max-width: 1024px) 100vw, 980px"
              />

              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />

              <div className="pointer-events-none absolute top-3 left-4 text-[10px] text-zinc-400 font-mono">
                [CAM_03: PLASMA_CONTAINMENT_RING]
              </div>
              <div className="pointer-events-none absolute top-3 right-4 text-[10px] text-emerald-400 font-mono">
                OUTPUT: {coils.reduce((a, b) => a + b, 0)} MW / 400 MW
              </div>

              {/* Extraction Hotspot */}
              {reactorStabilized && (
                <button
                  type="button"
                  onClick={handleExtractKeycard}
                  className="absolute top-[52%] left-[50%] -translate-x-1/2 -translate-y-1/2 p-3 rounded-xl bg-black/90 border border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-center space-y-1 cursor-pointer group/card"
                >
                  <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">
                    {extractedKeycard ? 'Security Items Acquired ✓' : 'Extract Root Keycard & Shard B ↵'}
                  </span>
                  <span className="text-xs text-zinc-200 block">
                    {extractedKeycard ? 'Payload: "999" & Level-5 Keycard' : 'Click to retrieve tokens'}
                  </span>
                </button>
              )}
            </div>

            {/* Plasma Coils Flux Balancer Puzzle */}
            <div className="p-6 rounded-2xl bg-[#09090e] border border-zinc-800 space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Icons.Fuse />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                      Magnetic Plasma Balancer (Target: 100 MW Each)
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 font-sans">
                    Shift energy through the inductive relays to balance all 4 coils to exactly 100 MW.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleResetCoils}
                  disabled={reactorStabilized}
                  className="px-3 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-[11px] text-zinc-400 hover:text-white border border-zinc-800 cursor-pointer disabled:opacity-40"
                >
                  Reset Coils
                </button>
              </div>

              {/* 4 Coil Bars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {coils.map((flux, i) => {
                  const names = ['Alpha', 'Beta', 'Gamma', 'Delta']
                  const isPerfect = flux === 100

                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                        isPerfect
                          ? 'bg-emerald-950/40 border-emerald-500/50'
                          : 'bg-black/60 border-zinc-850'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 font-bold">Coil {names[i]}</span>
                        <span className={`text-[10px] ${isPerfect ? 'text-emerald-400 font-bold' : 'text-zinc-400'}`}>
                          {flux} MW
                        </span>
                      </div>

                      <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isPerfect ? 'bg-emerald-400' : 'bg-cyan-500'
                          }`}
                          style={{ width: `${Math.min(100, (flux / 160) * 100)}%` }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleShiftFlux(i)}
                        disabled={reactorStabilized}
                        className="w-full py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-[11px] text-zinc-200 hover:text-white transition-all cursor-pointer disabled:opacity-40"
                      >
                        Shift Flux ↵
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Navigation */}
              <div className="pt-3 border-t border-zinc-850 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => navigateTo('servers')}
                  className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>←</span>
                  <span>Return to Sector 02: Data Core</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('vault')}
                  disabled={!reactorStabilized}
                  className="px-4 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs transition-all cursor-pointer disabled:opacity-40"
                >
                  Proceed to Sector 04: Security Vault →
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* CHAMBER 04: SECURITY VAULT & ELEVATOR NEXUS              */}
        {/* ======================================================== */}
        {currentRoom === 'vault' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-[10px] tracking-widest text-amber-400 font-bold uppercase">
                  Deck 04 High Security
                </span>
                <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-white uppercase mt-0.5">
                  Chamber 04: Security Vault
                </h1>
              </div>
              <div className="text-right text-[11px] text-zinc-400">
                BLAST DOOR: {vaultDoorOpen ? 'UNLOCKED' : 'HYDRAULICALLY SEALED'}
              </div>
            </div>

            {/* Viewport for Vault Door */}
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-[16/9] max-h-[460px] shadow-2xl group">
              <Image
                src="/images/void_vault.jpg"
                alt="Security Vault"
                fill
                priority
                className="object-cover opacity-85 group-hover:opacity-95 transition-opacity duration-700"
                sizes="(max-width: 1024px) 100vw, 980px"
              />

              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />

              <div className="pointer-events-none absolute top-3 left-4 text-[10px] text-zinc-400 font-mono">
                [CAM_04: HIGH_SECURITY_CONTAINMENT]
              </div>
              <div className="pointer-events-none absolute top-3 right-4 text-[10px] text-amber-400 font-mono">
                LASER INTERLOCK: {keycardInserted ? 'BYPASSED' : 'ACTIVE'}
              </div>

              {/* Status on Vault Console */}
              <div className="absolute top-[52%] left-[50%] -translate-x-1/2 -translate-y-1/2 p-3 rounded-xl bg-black/85 border border-zinc-700 max-w-xs text-center space-y-1 shadow-2xl">
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
            </div>

            {/* Dual Vault Unlock Subsystems */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Step 1: Insert Keycard */}
              <div className="p-5 rounded-xl bg-[#09090e] border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icons.Keycard />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">
                      Security Receptor
                    </span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${keycardInserted ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-amber-950/60 text-amber-400 border border-amber-800'}`}>
                    {keycardInserted ? 'KEYCARD VALIDATED' : 'WAITING'}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  {keycardInserted
                    ? 'Laser containment bypassed. Master decryption input matrix online.'
                    : 'Insert your Root Keycard recovered from Sector 03 to bypass laser grids.'}
                </p>

                {!keycardInserted && (
                  <button
                    type="button"
                    onClick={handleInsertKeycard}
                    className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 hover:border-emerald-400 text-xs text-zinc-200 hover:text-white transition-all cursor-pointer font-mono"
                  >
                    Insert Root Keycard
                  </button>
                )}
              </div>

              {/* Step 2: Combine Shards Cipher */}
              <div className="p-5 rounded-xl bg-[#09090e] border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icons.Terminal />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">
                      Master Cipher Decryption
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">
                    MAINFRAME v4
                  </span>
                </div>

                {keycardInserted ? (
                  <form onSubmit={handleSolveVaultCipher} className="space-y-3">
                    <p className="text-xs text-zinc-400 font-sans">
                      Combine Shard A (Sector 02) and Shard B (Sector 03) to synthesize the root password.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={cipherInput}
                        onChange={(e) => setCipherInput(e.target.value)}
                        placeholder="ENTER COMBINED CIPHER..."
                        className="flex-1 px-3.5 py-2 rounded-lg bg-black/90 border border-zinc-800 focus:border-emerald-500 text-emerald-400 text-xs font-mono outline-none tracking-wider uppercase"
                        autoCapitalize="characters"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800 text-emerald-300 text-xs font-mono transition-all cursor-pointer"
                      >
                        Unlock
                      </button>
                    </div>
                    {cipherError && (
                      <p className="text-[11px] text-red-400 font-mono">
                        Error: Cipher invalid. Check Shards in your inventory.
                      </p>
                    )}
                  </form>
                ) : (
                  <div className="p-4 rounded-lg bg-black/60 border border-zinc-850 text-xs text-zinc-500 font-mono text-center">
                    Subsystem interlocked. Validate Keycard first.
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="pt-3 border-t border-zinc-850 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigateTo('reactor')}
                className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span>←</span>
                <span>Return to Sector 03: Plasma Core</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('bridge')}
                disabled={!vaultDoorOpen}
                className="px-4 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs transition-all cursor-pointer disabled:opacity-40"
              >
                Ascend to Sector 05: Apex Observation Bridge →
              </button>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* CHAMBER 05: APEX OBSERVATION BRIDGE (VICTORY)            */}
        {/* ======================================================== */}
        {currentRoom === 'bridge' && (
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-[10px] tracking-widest text-emerald-400 font-bold uppercase">
                  Station Apex
                </span>
                <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-white uppercase mt-0.5">
                  Chamber 05: Observation Bridge
                </h1>
              </div>
              <div className="text-right text-[11px] text-emerald-400 font-bold">
                ROOT OVERLORD: CLEARED
              </div>
            </div>

            {/* Panoramic Bridge Viewport */}
            <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-zinc-950 aspect-[16/9] max-h-[460px] shadow-[0_0_50px_rgba(16,185,129,0.15)] group">
              <Image
                src="/images/void_bridge.jpg"
                alt="Observation Bridge"
                fill
                priority
                className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                sizes="(max-width: 1024px) 100vw, 980px"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-80" />

              <div className="pointer-events-none absolute top-3 left-4 text-[10px] text-zinc-400 font-mono">
                [CAM_FEED: ORBITAL_OBSERVATION_BRIDGE]
              </div>
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-zinc-300 font-mono">
                <span>ORBIT: DEEP SPACE SECTOR 999</span>
                <span className="text-emerald-400">OPERATOR PRIVILEGES: ELEVATED</span>
              </div>
            </div>

            {/* Victory Briefing */}
            <div className="p-6 rounded-xl bg-[#09090e] border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2">
                <Icons.Check />
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                  Station Subsystems Fully Restored
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                You navigated the airlock pressure equalization, calibrated carrier frequencies, stabilized plasma coils, and unlocked the high-security vault. Two persistent operator privileges have been permanently unlocked:
              </p>
            </div>

            {/* REWARD A: Terminal Master Code */}
            <div className="p-6 rounded-xl bg-[#09090e] border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">
                    Privilege A: Terminal Sudo Root Key
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  SYSTEM OVERRIDE
                </span>
              </div>

              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Execute this cryptographic token on the primary landing terminal via <span className="text-emerald-400 font-mono font-bold">sudo VOID-ROOT-999</span> to unlock elevated diagnostics and easter eggs.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1 px-4 py-3 rounded-lg bg-black/90 border border-zinc-850 text-sm text-emerald-400 font-mono font-bold tracking-wider select-all">
                  VOID-ROOT-999
                </div>
                <button
                  type="button"
                  onClick={handleCopyMasterKey}
                  className="px-5 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 hover:border-emerald-400 text-xs text-zinc-200 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 font-mono"
                >
                  <span>{copiedKey ? 'Code Copied' : 'Copy Sudo Token'}</span>
                  {copiedKey ? <Icons.Check /> : <Icons.Copy />}
                </button>
              </div>
            </div>

            {/* REWARD B: Station Transmissions Log (Real Data Only - Zero Mock Users) */}
            <div className="p-6 rounded-xl bg-[#09090e] border border-zinc-800 space-y-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">
                    Privilege B: Void Transmissions Registry
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-sans">
                  Engrave your callsign and dispatch into the station permanent memory.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleGuestbookSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Operator Callsign / Handle..."
                    className="px-4 py-2.5 rounded-lg bg-black/90 border border-zinc-850 focus:border-emerald-500 text-xs text-zinc-200 outline-none font-mono"
                    required
                  />
                  <input
                    type="text"
                    value={guestMsg}
                    onChange={(e) => setGuestMsg(e.target.value)}
                    placeholder="Transmission dispatch note..."
                    className="px-4 py-2.5 rounded-lg bg-black/90 border border-zinc-850 focus:border-emerald-500 text-xs text-zinc-200 outline-none font-mono"
                    required
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 hover:border-emerald-400 text-xs text-zinc-200 hover:text-white transition-all cursor-pointer font-mono"
                  >
                    Transmit to Memory Registry ↵
                  </button>
                  {submittedGuestbook && (
                    <span className="text-xs text-emerald-400 font-mono">
                      Transmission recorded on sector ledger.
                    </span>
                  )}
                </div>
              </form>

              {/* Feed */}
              <div className="space-y-3 pt-3 border-t border-zinc-850">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>DISPATCH LOG</span>
                  <span>{guestbook.length} entries registered</span>
                </div>

                {guestbook.length === 0 ? (
                  <div className="p-4 rounded-lg bg-black/50 border border-zinc-850 text-xs text-zinc-500 font-mono text-center">
                    [NO PREVIOUS DISPATCHES REGISTERED IN SECTOR 999. ENGRAVE THE INITIAL LOG.]
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {guestbook.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-3 rounded-lg bg-black/70 border border-zinc-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
                      >
                        <div className="space-x-2">
                          <span className="text-emerald-400 font-semibold">{entry.name}:</span>
                          <span className="text-zinc-300">{entry.message}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 shrink-0">{entry.timestamp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* TACTICAL INVENTORY & LOG STREAM DOCK                     */}
        {/* ======================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Inventory Panel (5 cols) */}
          <div className="md:col-span-5 p-5 rounded-xl bg-[#09090e] border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="uppercase tracking-wider font-semibold">Inventory Deck</span>
              <span>{inventory.length} items</span>
            </div>

            {inventory.length === 0 ? (
              <p className="text-xs text-zinc-600 italic py-4 text-center font-mono">
                [Inventory slots vacant. Inspect chamber objects.]
              </p>
            ) : (
              <div className="space-y-2">
                {inventory.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      sfx.playClick()
                      setSelectedItem(item === selectedItem ? null : item)
                    }}
                    className={`w-full p-3 rounded-lg text-left transition-all flex items-start gap-3 border cursor-pointer ${
                      selectedItem?.id === item.id
                        ? 'bg-zinc-900 border-emerald-500/50'
                        : 'bg-black/60 border-zinc-850 hover:border-zinc-700'
                    }`}
                  >
                    <div className="p-1 rounded bg-zinc-900 border border-zinc-800 shrink-0">
                      {item.id === 'fuse' && <Icons.Fuse />}
                      {item.id === 'slate' && <Icons.Slate />}
                      {item.id === 'shardA' && <Icons.Crystal />}
                      {item.id === 'shardB' && <Icons.Crystal />}
                      {item.id === 'keycard' && <Icons.Keycard />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-200 truncate">
                          {item.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                        {item.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Item Detail Inspector Drawer */}
            {selectedItem && (
              <div className="p-3 rounded-lg bg-black/80 border border-zinc-800 text-xs space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-semibold block">
                  Diagnostic Telemetry: {selectedItem.name}
                </span>
                <p className="text-[11px] text-zinc-300 font-mono">
                  {selectedItem.spec}
                </p>
              </div>
            )}
          </div>

          {/* Activity Console Log (7 cols) */}
          <div className="md:col-span-7 p-5 rounded-xl bg-[#09090e] border border-zinc-800 space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="uppercase tracking-wider font-semibold">Telemetry & Activity Stream</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div
              ref={logBottomRef}
              className="h-44 overflow-y-auto space-y-1.5 font-mono text-xs text-zinc-400 bg-black/70 p-3.5 rounded-lg border border-zinc-850"
            >
              {log.map((entry, i) => (
                <div key={i} className="leading-relaxed">
                  <span className="text-emerald-400/80">{entry.slice(0, 10)}</span>
                  <span>{entry.slice(10)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-6 border-t border-zinc-800 text-center text-xs text-zinc-600">
          <p>imlast999 · orbital void station simulation 999 · {new Date().getFullYear()}</p>
        </footer>
      </div>
    </main>
  )
}
