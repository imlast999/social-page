'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface InventoryItem {
  id: string
  name: string
  icon: string
  description: string
}

interface GuestbookEntry {
  id: string
  name: string
  message: string
  timestamp: string
}

const INITIAL_GUESTBOOK: GuestbookEntry[] = [
  {
    id: '1',
    name: 'satoshi_ghost',
    message: 'the digital void never sleeps. clean aesthetics.',
    timestamp: '2026-09-21 04:12 UTC',
  },
  {
    id: '2',
    name: 'cyber_wanderer',
    message: 'solved the reactor circuit in 40s. god mode unlocked.',
    timestamp: '2026-09-24 19:30 UTC',
  },
  {
    id: '3',
    name: '0xVoidSeeker',
    message: 'imlast999 systems are solid. greetings from the matrix.',
    timestamp: '2026-09-27 22:05 UTC',
  },
]

export default function VoidAdventure() {
  const [currentRoom, setCurrentRoom] = useState<'airlock' | 'core' | 'victory'>('airlock')
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [log, setLog] = useState<string[]>([
    'SYSTEM INITIALIZED: Welcome to Orbital Void Station 999.',
    'WARNING: Primary power grid offline. Explore the room to restore control.',
  ])
  
  // Puzzle States
  const [lockerOpened, setLockerOpened] = useState(false)
  const [powerRestored, setPowerRestored] = useState(false)
  const [keycardInserted, setKeycardInserted] = useState(false)
  const [cipherInput, setCipherInput] = useState('')
  const [cipherError, setCipherError] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)

  // Guestbook
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>(INITIAL_GUESTBOOK)
  const [guestName, setGuestName] = useState('')
  const [guestMsg, setGuestMsg] = useState('')
  const [submittedGuestbook, setSubmittedGuestbook] = useState(false)

  const logBottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load local guestbook if stored
    const saved = localStorage.getItem('void_guestbook')
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

  const addLog = (msg: string) => {
    setLog((prev) => [...prev, `[${new Date().toLocaleTimeString('en-GB')}] ${msg}`])
  }

  const hasItem = (id: string) => inventory.some((i) => i.id === id)

  // Actions in Room 1: Airlock & Maintenance Bay
  const handleInspectLocker = () => {
    if (lockerOpened) {
      addLog('Locker is already unlocked and empty.')
      return
    }
    setLockerOpened(true)
    const fuseItem: InventoryItem = {
      id: 'fuse',
      name: 'Quantum Fuse',
      icon: '⚡',
      description: 'Superconducting plasma fuse for relay grid.',
    }
    const slateItem: InventoryItem = {
      id: 'slate',
      name: 'Engineer Slate',
      icon: '📟',
      description: 'Notes say: Core Cipher key is "VOID999".',
    }
    setInventory((prev) => [...prev, fuseItem, slateItem])
    addLog('You opened the emergency locker! Acquired [Quantum Fuse] and [Engineer Slate].')
  }

  const handleInspectGenerator = () => {
    if (powerRestored) {
      addLog('Main power relay is humming smoothly at 100% efficiency.')
      return
    }
    if (hasItem('fuse')) {
      setPowerRestored(true)
      setInventory((prev) => prev.filter((i) => i.id !== 'fuse'))
      const keycard: InventoryItem = {
        id: 'keycard',
        name: 'Root Keycard',
        icon: '🔑',
        description: 'Level 5 Access Token for the Core Reactor.',
      }
      setInventory((prev) => [...prev, keycard])
      addLog('Inserted [Quantum Fuse] into the power relay! Power restored to airlock. Found [Root Keycard] on the console!')
    } else {
      addLog('Power Relay is dead. It requires a [Quantum Fuse] to boot.')
    }
  }

  const handleEnterCore = () => {
    if (!powerRestored) {
      addLog('Airlock door is locked. Restore station power to open the hydraulic hatch.')
      return
    }
    setCurrentRoom('core')
    addLog('Transitioning into Room 2: The Operator Core.')
  }

  // Actions in Room 2: The Operator Core
  const handleInsertKeycard = () => {
    if (!hasItem('keycard')) {
      addLog('You need a [Root Keycard] to activate the quantum reactor.')
      return
    }
    setKeycardInserted(true)
    addLog('Inserted [Root Keycard]. Mainframe terminal online! Please enter the decryption cipher.')
  }

  const handleSolveCipher = (e: React.FormEvent) => {
    e.preventDefault()
    if (cipherInput.trim().toUpperCase() === 'VOID999') {
      setCurrentRoom('victory')
      addLog('ACCESS GRANTED! Master Root protocol activated. Welcome, Operator.')
    } else {
      setCipherError(true)
      addLog('CIPHER REJECTED. Hint: Check your [Engineer Slate] in your inventory.')
      setTimeout(() => setCipherError(false), 2000)
    }
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
    localStorage.setItem('void_guestbook', JSON.stringify(updated))
    setSubmittedGuestbook(true)
    setGuestName('')
    setGuestMsg('')
  }

  const handleCopyMasterKey = () => {
    navigator.clipboard.writeText('VOID-ROOT-999')
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2200)
  }

  return (
    <main className="min-h-screen w-full bg-[#050508] text-white select-none relative overflow-x-hidden font-sans pb-16">
      {/* Background Subtle Cyber Grid */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-cyber-grid opacity-30" />
      
      {/* Ambient Void Glows */}
      <div className="pointer-events-none fixed top-1/4 left-1/3 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[160px]" />
      <div className="pointer-events-none fixed bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-8">
        {/* Navigation Header */}
        <header className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
          <Link
            href="/"
            className="group flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            <span className="transition-transform group-hover:-translate-x-1 font-bold">←</span>
            <span>return to orbit</span>
          </Link>

          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>VOID SECTOR 999 · {currentRoom.toUpperCase()}</span>
          </div>
        </header>

        {/* ======================================================== */}
        {/* ROOM 1: AIRLOCK & MAINTENANCE BAY                        */}
        {/* ======================================================== */}
        {currentRoom === 'airlock' && (
          <section className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
                Chamber 01: Maintenance Airlock
              </h1>
              <p className="text-xs sm:text-sm font-mono text-zinc-400">
                Point and click on station elements to interact and route power.
              </p>
            </div>

            {/* Interactive Scene Canvas Box */}
            <div className="relative rounded-2xl bg-gradient-to-br from-[#0c0c14]/98 via-[#090910]/95 to-[#06060a]/98 border border-zinc-700/80 p-6 sm:p-8 min-h-[340px] flex flex-col justify-between overflow-hidden shadow-2xl">
              {/* Scanlines overlay */}
              <div className="terminal-scanlines pointer-events-none absolute inset-0 opacity-20" />
              
              {/* Interactive Point & Click Objects in Room */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                {/* Object 1: Emergency Locker */}
                <button
                  type="button"
                  onClick={handleInspectLocker}
                  className="p-5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-700/80 hover:border-emerald-500/60 transition-all text-left space-y-3 cursor-pointer group shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🗄️</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      lockerOpened ? 'text-zinc-500 border-zinc-800' : 'text-emerald-400 border-emerald-500/30'
                    }`}>
                      {lockerOpened ? 'UNLOCKED' : 'INTERACTIVE'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white group-hover:text-emerald-300">
                      Emergency Locker
                    </h3>
                    <p className="text-xs font-mono text-zinc-400 mt-1">
                      {lockerOpened ? 'Empty wall locker.' : 'Click to inspect emergency supplies.'}
                    </p>
                  </div>
                </button>

                {/* Object 2: Power Relay */}
                <button
                  type="button"
                  onClick={handleInspectGenerator}
                  className="p-5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-700/80 hover:border-emerald-500/60 transition-all text-left space-y-3 cursor-pointer group shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">⚡</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      powerRestored ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' : 'text-amber-400 border-amber-500/30'
                    }`}>
                      {powerRestored ? 'ONLINE (100%)' : 'OFFLINE'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white group-hover:text-emerald-300">
                      Power Relay Grid
                    </h3>
                    <p className="text-xs font-mono text-zinc-400 mt-1">
                      {powerRestored ? 'Power routed to airlock hatch.' : 'Needs a quantum fuse to boot.'}
                    </p>
                  </div>
                </button>

                {/* Object 3: Hydraulic Hatch to Core */}
                <button
                  type="button"
                  onClick={handleEnterCore}
                  className="p-5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-700/80 hover:border-emerald-500/60 transition-all text-left space-y-3 cursor-pointer group shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🚪</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      powerRestored ? 'text-emerald-400 border-emerald-500/40 animate-pulse' : 'text-zinc-500 border-zinc-800'
                    }`}>
                      {powerRestored ? 'UNLOCKED →' : 'SEALED'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white group-hover:text-emerald-300">
                      Core Access Hatch
                    </h3>
                    <p className="text-xs font-mono text-zinc-400 mt-1">
                      {powerRestored ? 'Hatch open! Click to enter Core.' : 'Requires power to open.'}
                    </p>
                  </div>
                </button>
              </div>

              {/* Status footer inside card */}
              <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>SECTOR: 01-A</span>
                <span className="text-emerald-400">Goal: Restore power and access Core</span>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* ROOM 2: THE OPERATOR CORE                                */}
        {/* ======================================================== */}
        {currentRoom === 'core' && (
          <section className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
                Chamber 02: The Operator Core
              </h1>
              <p className="text-xs sm:text-sm font-mono text-zinc-400">
                Insert your Keycard into the reactor, then enter the decipher key to claim root.
              </p>
            </div>

            <div className="relative rounded-2xl bg-gradient-to-br from-[#0c0c14]/98 via-[#090910]/95 to-[#06060a]/98 border border-zinc-700/80 p-6 sm:p-8 min-h-[340px] space-y-6 overflow-hidden shadow-2xl">
              <div className="terminal-scanlines pointer-events-none absolute inset-0 opacity-20" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                {/* Reactor Card */}
                <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-700/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">⚛️</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      keycardInserted ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' : 'text-amber-400 border-amber-500/30'
                    }`}>
                      {keycardInserted ? 'REACTOR ENGAGED' : 'KEYCARD REQUIRED'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white">Quantum Reactor Core</h3>
                    <p className="text-xs font-mono text-zinc-400 mt-1">
                      {keycardInserted ? 'Keycard validated. Terminal unlocked.' : 'Insert Root Keycard from inventory to unlock mainframe.'}
                    </p>
                  </div>
                  {!keycardInserted && (
                    <button
                      type="button"
                      onClick={handleInsertKeycard}
                      className="w-full py-2.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-semibold transition-all cursor-pointer"
                    >
                      Insert Root Keycard
                    </button>
                  )}
                </div>

                {/* Mainframe Decipher Terminal */}
                <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-700/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">💻</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border text-cyan-400 border-cyan-500/30">
                      MAINFRAME
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white">Decryption Console</h3>
                    <p className="text-xs font-mono text-zinc-400 mt-1">
                      Enter the master decryption cipher. (Check your Engineer Slate).
                    </p>
                  </div>

                  {keycardInserted ? (
                    <form onSubmit={handleSolveCipher} className="space-y-3">
                      <input
                        type="text"
                        value={cipherInput}
                        onChange={(e) => setCipherInput(e.target.value)}
                        placeholder="ENTER CIPHER CODE..."
                        className="w-full px-3.5 py-2 rounded-lg bg-black/70 border border-zinc-700 text-emerald-400 font-mono text-xs outline-none focus:border-emerald-500"
                        autoCapitalize="characters"
                      />
                      {cipherError && (
                        <p className="text-[11px] font-mono text-red-400">Cipher rejected. Check Slate!</p>
                      )}
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold transition-all cursor-pointer"
                      >
                        Authorize Root Access ↵
                      </button>
                    </form>
                  ) : (
                    <div className="p-3 rounded-lg bg-black/40 border border-zinc-800 text-xs font-mono text-zinc-500 text-center">
                      Locked. Engage reactor keycard first.
                    </div>
                  )}
                </div>
              </div>

              {/* Back to Airlock */}
              <div className="pt-4 border-t border-zinc-800/80 flex justify-start">
                <button
                  type="button"
                  onClick={() => setCurrentRoom('airlock')}
                  className="text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  ← Back to Airlock
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* ROOM 3: VICTORY & OPERATOR'S VAULT (OPTION A & B)        */}
        {/* ======================================================== */}
        {currentRoom === 'victory' && (
          <section className="space-y-8 animate-fadeIn">
            {/* Victory Banner */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-zinc-900/90 to-zinc-950 border border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.2)] space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest">
                  ROOT OVERLORD PRIVILEGES GRANTED
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-white">
                You Conquered the Void.
              </h1>
              <p className="text-xs sm:text-sm font-mono text-zinc-300 leading-relaxed max-w-2xl">
                Station systems unlocked. You have acquired the Master Terminal Root Password (Option A) and unlocked the Operator's Permanent Guestbook (Option B).
              </p>
            </div>

            {/* Reward Option A: God Mode Terminal Password */}
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-700/80 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-mono font-bold text-white flex items-center gap-2">
                  <span>⚡</span>
                  <span>REWARD A: TERMINAL ROOT ACCESS CODE</span>
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  SPECIAL SUDO KEY
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-400">
                Return to the home terminal and execute <span className="text-emerald-400 font-bold">sudo VOID-ROOT-999</span> to unlock God Mode & Easter Eggs!
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <div className="flex-1 px-4 py-3 rounded-xl bg-black/80 border border-zinc-800 font-mono text-sm text-emerald-400 font-bold tracking-widest flex items-center justify-between">
                  <span>VOID-ROOT-999</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyMasterKey}
                  className="px-6 py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                  <span>{copiedKey ? 'Code Copied!' : 'Copy Sudo Key'}</span>
                  <span>{copiedKey ? '✓' : '⧉'}</span>
                </button>
              </div>
            </div>

            {/* Reward Option B: The Void Guestbook */}
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-700/80 space-y-6">
              <div className="space-y-1">
                <h2 className="text-sm font-mono font-bold text-white flex items-center gap-2">
                  <span>✍️</span>
                  <span>REWARD B: THE VOID GUESTBOOK</span>
                </h2>
                <p className="text-xs font-mono text-zinc-400">
                  Leave your handle and message engraved on the station walls forever.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleGuestbookSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Your Handle / Twitter (e.g. @anon)"
                    className="px-3.5 py-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs font-mono text-white outline-none focus:border-emerald-500"
                    required
                  />
                  <input
                    type="text"
                    value={guestMsg}
                    onChange={(e) => setGuestMsg(e.target.value)}
                    placeholder="Engrave your message..."
                    className="px-3.5 py-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs font-mono text-white outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  Engrave into Void Log ↵
                </button>
                {submittedGuestbook && (
                  <span className="text-xs font-mono text-emerald-400 ml-3">Message engraved on the station!</span>
                )}
              </form>

              {/* Feed */}
              <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                <span className="text-[11px] font-mono text-zinc-500 block">RECORDED EXPLORERS:</span>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {guestbook.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3 rounded-xl bg-black/40 border border-zinc-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono"
                    >
                      <div className="space-x-2">
                        <span className="text-emerald-400 font-bold">{entry.name}:</span>
                        <span className="text-zinc-300">{entry.message}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 shrink-0">{entry.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* INVENTORY BAR & ACTIVITY LOGS                            */}
        {/* ======================================================== */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Inventory Drawer */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <span className="text-[11px] font-mono text-zinc-400 font-bold block uppercase tracking-wider">
              🎒 Inventory ({inventory.length})
            </span>
            {inventory.length === 0 ? (
              <p className="text-xs font-mono text-zinc-600 italic py-2">Pockets are empty. Explore the room.</p>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {inventory.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg bg-black/50 border border-zinc-800 flex items-start gap-2.5"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <span className="text-xs font-mono text-emerald-400 font-bold block">{item.name}</span>
                      <span className="text-[11px] font-mono text-zinc-400 block">{item.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Console Log */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between">
            <span className="text-[11px] font-mono text-zinc-400 font-bold block uppercase tracking-wider">
              📟 Station Activity Log
            </span>
            <div
              ref={logBottomRef}
              className="h-28 overflow-y-auto space-y-1 font-mono text-[11px] text-zinc-400 bg-black/50 p-2.5 rounded-lg border border-zinc-800/80"
            >
              {log.map((entry, i) => (
                <p key={i} className="leading-relaxed">
                  {entry}
                </p>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
