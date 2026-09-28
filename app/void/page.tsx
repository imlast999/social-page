'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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

/* Bespoke SVG Icons - Zero emojis */
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
  Terminal: () => (
    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
  Crosshair: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="22" y1="12" x2="18" y2="12" />
      <line x1="6" y1="12" x2="2" y2="12" />
      <line x1="12" y1="6" x2="12" y2="2" />
      <line x1="12" y1="22" x2="12" y2="18" />
    </svg>
  ),
  Lock: () => (
    <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Unlock: () => (
    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
}

export default function VoidAdventure() {
  const [currentRoom, setCurrentRoom] = useState<'airlock' | 'core' | 'bridge'>('airlock')
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  
  const [log, setLog] = useState<string[]>([
    '[SEC_INIT] Sector 999 telemetry active.',
    '[ALERT] Primary hydraulic power grid uncoupled. Explore the chamber.',
  ])

  // Puzzle State Variables
  const [lockerOpened, setLockerOpened] = useState(false)
  const [powerRestored, setPowerRestored] = useState(false)
  const [keycardInserted, setKeycardInserted] = useState(false)
  const [cipherInput, setCipherInput] = useState('')
  const [cipherError, setCipherError] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)

  // Real Transmissions Log (Guestbook - No fake AI mock users)
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>([])
  const [guestName, setGuestName] = useState('')
  const [guestMsg, setGuestMsg] = useState('')
  const [submittedGuestbook, setSubmittedGuestbook] = useState(false)

  const logBottomRef = useRef<HTMLDivElement>(null)

  // Load persistent user transmissions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('void_transmissions_v2')
    if (saved) {
      try {
        setGuestbook(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse void guestbook:', e)
      }
    }
  }, [])

  useEffect(() => {
    if (logBottomRef.current) {
      logBottomRef.current.scrollTop = logBottomRef.current.scrollHeight
    }
  }, [log])

  const addLog = (tag: string, text: string) => {
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false })
    setLog((prev) => [...prev, `[${time}] [${tag}] ${text}`])
  }

  const hasItem = (id: string) => inventory.some((i) => i.id === id)

  /* Chamber 1 Handlers */
  const handleInspectLocker = () => {
    if (lockerOpened) {
      addLog('SCAN', 'Auxiliary maintenance locker is unlatched. Storage cell empty.')
      return
    }
    setLockerOpened(true)
    const fuseItem: InventoryItem = {
      id: 'fuse',
      name: 'Superconductor Fuse',
      type: 'POWER_COMPONENT',
      description: 'Ultra-low resistance plasma relay fuse.',
      spec: 'Rating: 1200V / 400A superconducting ceramic.',
    }
    const slateItem: InventoryItem = {
      id: 'slate',
      name: 'Maintenance Slate',
      type: 'DATA_CRYSTAL',
      description: 'Encrypted field terminal with engineer notes.',
      spec: 'Decrypted string found: "CIPHER: VOID999".',
    }
    setInventory((prev) => [...prev, fuseItem, slateItem])
    addLog('ACQUIRE', 'Unlatched maintenance locker. Recovered [Superconductor Fuse] & [Maintenance Slate].')
  }

  const handleInspectGenerator = () => {
    if (powerRestored) {
      addLog('STATUS', 'Power grid nominal. Output steady at 100% capacity.')
      return
    }
    if (hasItem('fuse')) {
      setPowerRestored(true)
      setInventory((prev) => prev.filter((i) => i.id !== 'fuse'))
      if (selectedItem?.id === 'fuse') setSelectedItem(null)
      
      const keycard: InventoryItem = {
        id: 'keycard',
        name: 'Root Keycard',
        type: 'AUTH_TOKEN',
        description: 'Level-5 Cryptographic Security Card.',
        spec: 'Authorizes manual override of Reactor Core systems.',
      }
      setInventory((prev) => [...prev, keycard])
      addLog('ENGAGE', 'Inserted [Superconductor Fuse] into breaker array. Station power restored.')
      addLog('ACQUIRE', 'Retrieved [Root Keycard] from energized control deck.')
    } else {
      addLog('FAIL', 'Relay matrix disconnected. A [Superconductor Fuse] is required.')
    }
  }

  const handleEnterCore = () => {
    if (!powerRestored) {
      addLog('SEALED', 'Pressure door lock interlocked. Hydraulic circuit offline.')
      return
    }
    setCurrentRoom('core')
    addLog('TRANSIT', 'Hydraulic hatch pressurized. Transitioning to Chamber 02: Core Reactor.')
  }

  /* Chamber 2 Handlers */
  const handleInsertKeycard = () => {
    if (!hasItem('keycard')) {
      addLog('AUTH_FAIL', 'Cryptographic keycard required to initialize core interface.')
      return
    }
    setKeycardInserted(true)
    addLog('ONLINE', 'Root Keycard accepted. Decryption subsystem online.')
  }

  const handleSolveCipher = (e: React.FormEvent) => {
    e.preventDefault()
    if (cipherInput.trim().toUpperCase() === 'VOID999') {
      setCurrentRoom('bridge')
      addLog('GRANTED', 'Decryption successful. Master Root privileges assigned.')
      addLog('TRANSIT', 'Airlock disengaged. Entering Chamber 03: Observation Bridge.')
    } else {
      setCipherError(true)
      addLog('REJECT', 'Cipher invalid. Consult [Maintenance Slate] in inventory.')
      setTimeout(() => setCipherError(false), 2400)
    }
  }

  /* Chamber 3 Handlers (Victory & Dual Rewards) */
  const handleCopyMasterKey = () => {
    navigator.clipboard.writeText('VOID-ROOT-999')
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2200)
  }

  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
    addLog('ENGRAVE', `Transmission saved to station memory by ${newEntry.name}.`)
  }

  return (
    <main className="min-h-screen w-full bg-[#050508] text-zinc-100 select-none relative overflow-x-hidden font-mono antialiased pb-20">
      {/* Background Cyber Grid */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-cyber-grid opacity-20" />
      
      {/* Ambient Lighting */}
      <div className="pointer-events-none fixed top-1/4 left-1/3 w-[500px] h-[500px] bg-purple-950/15 rounded-full blur-[150px]" />
      <div className="pointer-events-none fixed bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        
        {/* Navigation & Telemetry Header */}
        <header className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <Link
            href="/"
            className="group flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <Icons.Back />
            <span>RETURN TO ORBIT</span>
          </Link>

          <div className="flex items-center gap-3 text-[11px] text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SECTOR 999</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-200">
              {currentRoom === 'airlock' && 'CHAMBER 01: AIRLOCK'}
              {currentRoom === 'core' && 'CHAMBER 02: REACTOR CORE'}
              {currentRoom === 'bridge' && 'CHAMBER 03: OBSERVATION BRIDGE'}
            </span>
          </div>
        </header>

        {/* ======================================================== */}
        {/* CHAMBER 01: AIRLOCK & MAINTENANCE BAY                    */}
        {/* ======================================================== */}
        {currentRoom === 'airlock' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-[10px] tracking-widest text-emerald-400 font-bold uppercase">
                  Point-and-Click Simulation
                </span>
                <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-white uppercase mt-0.5">
                  Chamber 01: Maintenance Airlock
                </h1>
              </div>
              <div className="text-right text-[11px] text-zinc-400">
                SYSTEM INTEGRITY: {powerRestored ? '100% ONLINE' : 'AUXILIARY ONLY'}
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
              
              {/* Scanline Texture */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />

              {/* Viewport Corner Reticles */}
              <div className="pointer-events-none absolute top-3 left-4 text-[10px] text-zinc-400 font-mono">
                [CAM_FEED: AIRLOCK_SUBDECK_01]
              </div>
              <div className="pointer-events-none absolute top-3 right-4 text-[10px] text-emerald-400 font-mono">
                STATUS: {powerRestored ? 'DECOMPRESSED' : 'STANDBY'}
              </div>

              {/* HOTSPOT 1: Emergency Locker (Left Deck) */}
              <button
                type="button"
                onClick={handleInspectLocker}
                className="absolute top-[48%] left-[16%] -translate-x-1/2 -translate-y-1/2 p-2 rounded-lg bg-black/75 hover:bg-black/95 border border-zinc-700 hover:border-emerald-400 transition-all cursor-pointer group/spot shadow-xl"
                title="Inspect Maintenance Locker"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] font-mono text-zinc-200 group-hover/spot:text-emerald-300">
                    {lockerOpened ? 'Locker [Empty]' : 'Maintenance Locker'}
                  </span>
                </div>
              </button>

              {/* HOTSPOT 2: Power Relay (Center Console) */}
              <button
                type="button"
                onClick={handleInspectGenerator}
                className="absolute top-[68%] left-[50%] -translate-x-1/2 -translate-y-1/2 p-2 rounded-lg bg-black/75 hover:bg-black/95 border border-zinc-700 hover:border-emerald-400 transition-all cursor-pointer group/spot shadow-xl"
                title="Inspect Power Relay"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${powerRestored ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                  <span className="text-[11px] font-mono text-zinc-200 group-hover/spot:text-emerald-300">
                    {powerRestored ? 'Power Relay [Active]' : 'Power Relay [Requires Fuse]'}
                  </span>
                </div>
              </button>

              {/* HOTSPOT 3: Hydraulic Door (Far Right) */}
              <button
                type="button"
                onClick={handleEnterCore}
                className="absolute top-[45%] right-[10%] -translate-y-1/2 p-2.5 rounded-lg bg-black/75 hover:bg-black/95 border border-zinc-700 hover:border-emerald-400 transition-all cursor-pointer group/spot shadow-xl"
                title="Core Access Hatch"
              >
                <div className="flex items-center gap-2">
                  {powerRestored ? <Icons.Unlock /> : <Icons.Lock />}
                  <span className={`text-[11px] font-mono ${powerRestored ? 'text-emerald-300 font-bold' : 'text-zinc-400'}`}>
                    {powerRestored ? 'Enter Core Hatch →' : 'Core Hatch [Locked]'}
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
                    {lockerOpened ? 'UNLATCHED' : 'INTERACT'}
                  </span>
                </div>
                <div className="text-sm text-zinc-200 group-hover:text-emerald-400 transition-colors">
                  Maintenance Locker
                </div>
                <p className="text-[11px] text-zinc-400">
                  {lockerOpened ? 'Supplies extracted.' : 'Scan and release auxiliary storage latch.'}
                </p>
              </button>

              <button
                type="button"
                onClick={handleInspectGenerator}
                className="p-4 rounded-xl bg-[#09090e] border border-zinc-800 hover:border-zinc-700 transition-all text-left space-y-2 cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">OBJECT 02</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${powerRestored ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-amber-950/60 text-amber-400 border border-amber-800'}`}>
                    {powerRestored ? '100% ONLINE' : 'SEVERED'}
                  </span>
                </div>
                <div className="text-sm text-zinc-200 group-hover:text-emerald-400 transition-colors">
                  Power Relay Matrix
                </div>
                <p className="text-[11px] text-zinc-400">
                  {powerRestored ? 'Circuit locked. Grid stable.' : 'Needs superconducting fuse.'}
                </p>
              </button>

              <button
                type="button"
                onClick={handleEnterCore}
                className="p-4 rounded-xl bg-[#09090e] border border-zinc-800 hover:border-zinc-700 transition-all text-left space-y-2 cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">OBJECT 03</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${powerRestored ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-zinc-900 text-zinc-500'}`}>
                    {powerRestored ? 'READY' : 'OFFLINE'}
                  </span>
                </div>
                <div className="text-sm text-zinc-200 group-hover:text-emerald-400 transition-colors">
                  Core Access Hatch
                </div>
                <p className="text-[11px] text-zinc-400">
                  {powerRestored ? 'Pressure equalized. Click to proceed.' : 'Unpowered bulkhead.'}
                </p>
              </button>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* CHAMBER 02: THE OPERATOR CORE                            */}
        {/* ======================================================== */}
        {currentRoom === 'core' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-[10px] tracking-widest text-emerald-400 font-bold uppercase">
                  Station Central Core
                </span>
                <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-white uppercase mt-0.5">
                  Chamber 02: Reactor Core
                </h1>
              </div>
              <div className="text-right text-[11px] text-zinc-400">
                CONTAINMENT: {keycardInserted ? 'ENGAGED' : 'AWAITING KEYCARD'}
              </div>
            </div>

            {/* Viewport for Room 2 */}
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-[16/9] max-h-[460px] shadow-2xl group">
              <Image
                src="/images/void_reactor.jpg"
                alt="Reactor Core Chamber"
                fill
                priority
                className="object-cover opacity-85 group-hover:opacity-95 transition-opacity duration-700"
                sizes="(max-width: 1024px) 100vw, 980px"
              />

              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />

              <div className="pointer-events-none absolute top-3 left-4 text-[10px] text-zinc-400 font-mono">
                [CAM_FEED: CORE_REACTOR_CHAMBER]
              </div>
              <div className="pointer-events-none absolute top-3 right-4 text-[10px] text-cyan-400 font-mono">
                STATUS: CRITICAL CONVERGENCE
              </div>

              {/* Reticle for Reactor Terminal */}
              <div className="absolute top-[52%] left-[50%] -translate-x-1/2 -translate-y-1/2 p-3 rounded-xl bg-black/80 border border-zinc-700 max-w-xs text-center space-y-1.5 shadow-2xl">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                  Quantum Mainframe
                </span>
                <span className="text-xs text-emerald-400 font-bold block">
                  {keycardInserted ? 'Cipher Authorization Required' : 'Root Keycard Interlock'}
                </span>
              </div>
            </div>

            {/* Core Interaction Console */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Keycard Receptor */}
              <div className="p-5 rounded-xl bg-[#09090e] border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icons.Keycard />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">
                      Keycard Receptor
                    </span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${keycardInserted ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-amber-950/60 text-amber-400 border border-amber-800'}`}>
                    {keycardInserted ? 'KEYCARD ACCEPTED' : 'DISENGAGED'}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  {keycardInserted
                    ? 'Security interlock bypassed. Encryption matrix routed to main terminal.'
                    : 'The central fusion mainframe requires cryptographic validation with a Root Keycard.'}
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

              {/* Card 2: Decryption Prompt */}
              <div className="p-5 rounded-xl bg-[#09090e] border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icons.Terminal />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">
                      Decryption Subsystem
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">
                    TERMINAL v2.4
                  </span>
                </div>

                {keycardInserted ? (
                  <form onSubmit={handleSolveCipher} className="space-y-3">
                    <p className="text-xs text-zinc-400 font-sans">
                      Provide the master decipher key. Check your Maintenance Slate for reference.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={cipherInput}
                        onChange={(e) => setCipherInput(e.target.value)}
                        placeholder="ENTER CIPHER CODE..."
                        className="flex-1 px-3.5 py-2 rounded-lg bg-black/90 border border-zinc-800 focus:border-emerald-500 text-emerald-400 text-xs font-mono outline-none tracking-wider uppercase"
                        autoCapitalize="characters"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800 text-emerald-300 text-xs font-mono transition-all cursor-pointer"
                      >
                        Authorize
                      </button>
                    </div>
                    {cipherError && (
                      <p className="text-[11px] text-red-400 font-mono">
                        Error: Cipher mismatch. Inspect [Maintenance Slate] in inventory.
                      </p>
                    )}
                  </form>
                ) : (
                  <div className="p-4 rounded-lg bg-black/60 border border-zinc-850 text-xs text-zinc-500 font-mono text-center">
                    Subsystem interlocked. Insert Root Keycard to enable terminal.
                  </div>
                )}
              </div>
            </div>

            {/* Back to Airlock */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentRoom('airlock')}
                className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span>←</span>
                <span>Return to Chamber 01: Maintenance Airlock</span>
              </button>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* CHAMBER 03: OBSERVATION BRIDGE & OPERATOR VAULT          */}
        {/* ======================================================== */}
        {currentRoom === 'bridge' && (
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-[10px] tracking-widest text-emerald-400 font-bold uppercase">
                  Station Apex
                </span>
                <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-white uppercase mt-0.5">
                  Chamber 03: Observation Bridge
                </h1>
              </div>
              <div className="text-right text-[11px] text-emerald-400 font-bold">
                ROOT PRIVILEGES: CONFIRMED
              </div>
            </div>

            {/* Cinematic Viewport for Victory Bridge */}
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
                <span className="text-emerald-400">OPERATOR CLEARANCE: LEVEL 5</span>
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
                You navigated the depressurized airlock, reconstructed the superconducting relay, and cracked the core encryption matrix. Two operator privileges have been unlocked:
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
                    onClick={() => setSelectedItem(item === selectedItem ? null : item)}
                    className={`w-full p-3 rounded-lg text-left transition-all flex items-start gap-3 border cursor-pointer ${
                      selectedItem?.id === item.id
                        ? 'bg-zinc-900 border-emerald-500/50'
                        : 'bg-black/60 border-zinc-850 hover:border-zinc-700'
                    }`}
                  >
                    <div className="p-1 rounded bg-zinc-900 border border-zinc-800 shrink-0">
                      {item.id === 'fuse' && <Icons.Fuse />}
                      {item.id === 'slate' && <Icons.Slate />}
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
