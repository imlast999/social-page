'use client'

import React, { useState, useRef, useEffect } from 'react'

interface HistoryItem {
  id: string
  type: 'input' | 'output' | 'error' | 'matrix'
  command?: string
  content?: React.ReactNode
}

interface TerminalProps {
  onExploreProjects?: () => void
}

const AVAILABLE_COMMANDS = [
  'about',
  'setup',
  'skills',
  'projects',
  'socials',
  'contact',
  'whoami',
  'uname',
  'ls',
  'matrix',
  'history',
  'clear',
  'sudo',
  'help',
]

export default function Terminal({ onExploreProjects }: TerminalProps) {
  const [inputVal, setInputVal] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'welcome-1',
      type: 'output',
      content: (
        <div className="text-zinc-300 font-mono text-xs sm:text-sm leading-relaxed space-y-1">
          <p className="text-zinc-500">
            Last login: {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} on ttys001
          </p>
          <p className="text-zinc-400">
            zsh 5.9 <span className="text-emerald-400/80">(x86_64-void-space)</span> — Type <span className="text-emerald-400 font-bold underline decoration-emerald-500/50">help</span> to view commands.
          </p>
        </div>
      ),
    },
  ])
  const [isMatrixRunning, setIsMatrixRunning] = useState(false)
  const contentBodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll ONLY inner terminal viewport on output
  useEffect(() => {
    if (contentBodyRef.current) {
      contentBodyRef.current.scrollTop = contentBodyRef.current.scrollHeight
    }
  }, [history, isMatrixRunning])

  const executeCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim()

    // 1. Real Terminal Behavior: Pressing Enter with no text outputs an empty prompt line
    if (!trimmed) {
      setHistory((prev) => [
        ...prev,
        {
          id: `in-${Date.now()}-${Math.random()}`,
          type: 'input',
          command: '',
        },
      ])
      setInputVal('')
      setHistoryIndex(-1)
      return
    }

    // Save to command memory for ArrowUp / ArrowDown navigation
    setCommandHistory((prev) => [...prev, rawCmd])
    setHistoryIndex(-1)

    const lowerCmd = trimmed.toLowerCase()

    const newHistory: HistoryItem[] = [
      ...history,
      {
        id: `in-${Date.now()}-${Math.random()}`,
        type: 'input',
        command: rawCmd,
      },
    ]

    switch (lowerCmd) {
      case 'help':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="text-zinc-300 font-mono text-xs sm:text-sm leading-relaxed py-1 space-y-2">
              <div className="text-zinc-400 font-semibold border-b border-zinc-800/80 pb-1">
                SYSTEM COMMANDS & UTILITIES:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">about</span>
                  <span className="text-zinc-400 text-xs">developer overview</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">setup</span>
                  <span className="text-zinc-400 text-xs">hardware & workstation</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">skills</span>
                  <span className="text-zinc-400 text-xs">tech stack & frameworks</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">projects</span>
                  <span className="text-zinc-400 text-xs">featured applications</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">socials</span>
                  <span className="text-zinc-400 text-xs">connected network endpoints</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">contact</span>
                  <span className="text-zinc-400 text-xs">direct communication</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">whoami</span>
                  <span className="text-zinc-400 text-xs">current identity info</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">uname</span>
                  <span className="text-zinc-400 text-xs">kernel & architecture</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">ls</span>
                  <span className="text-zinc-400 text-xs">list virtual filesystem</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">matrix</span>
                  <span className="text-zinc-400 text-xs">digital stream simulation</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">history</span>
                  <span className="text-zinc-400 text-xs">view entered commands</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">clear</span>
                  <span className="text-zinc-400 text-xs">wipe console buffer</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">sudo</span>
                  <span className="text-zinc-400 text-xs">super user elevation</span>
                </div>
              </div>
            </div>
          ),
        })
        break

      case 'about':
      case 'whoami':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="text-zinc-300 font-mono text-xs sm:text-sm leading-relaxed p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 pb-1 border-b border-zinc-800/80">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-white font-bold tracking-wide">IDENTITY PROFILE</span>
              </div>
              <p><span className="text-zinc-500 font-semibold w-24 inline-block">User:</span> <span className="text-emerald-400">imlast999</span></p>
              <p><span className="text-zinc-500 font-semibold w-24 inline-block">Role:</span> Builder & Creative Systems Developer</p>
              <p><span className="text-zinc-500 font-semibold w-24 inline-block">Domain:</span> <span className="text-cyan-400 underline">imlast999.is-a.dev</span></p>
              <p><span className="text-zinc-500 font-semibold w-24 inline-block">Focus:</span> Quantitative Trading Systems (LastEdge), Web3 Apps, Mobile UI Engineering</p>
              <p><span className="text-zinc-500 font-semibold w-24 inline-block">Summary:</span> Architecting high-performance trading pipelines, reactive web applications and sleek interfaces.</p>
            </div>
          ),
        })
        break

      case 'setup':
      case 'neofetch':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="text-zinc-300 font-mono text-xs sm:text-sm leading-relaxed p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-zinc-800/80">
                <span className="text-emerald-400 font-bold">imlast999@workstation</span>
                <span className="text-zinc-500 text-[11px]">x86_64-void</span>
              </div>
              <div className="grid grid-cols-1 gap-1 pt-1">
                <p><span className="text-emerald-400 font-bold inline-block w-20">OS:</span> Windows 11 Pro [Version 10.0.22631]</p>
                <p><span className="text-emerald-400 font-bold inline-block w-20">CPU:</span> 12th Gen Intel(R) Core(TM) i5-12400F (12 CPUs) @ 4.40GHz</p>
                <p><span className="text-emerald-400 font-bold inline-block w-20">GPU:</span> NVIDIA GeForce RTX 4060 Ti (8GB GDDR6)</p>
                <p><span className="text-emerald-400 font-bold inline-block w-20">RAM:</span> 32 GB DDR4 High-Speed Dual-Channel</p>
                <p><span className="text-emerald-400 font-bold inline-block w-20">Storage:</span> WD Blue SN580 1TB NVMe SSD (PCIe 4.0)</p>
                <p><span className="text-emerald-400 font-bold inline-block w-20">Shell:</span> zsh 5.9 (custom cosmic theme)</p>
              </div>
            </div>
          ),
        })
        break

      case 'skills':
      case 'stack':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="text-zinc-300 font-mono text-xs sm:text-sm leading-relaxed p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-2">
              <div className="text-emerald-400 font-bold pb-1 border-b border-zinc-800/80">
                CORE TECHNICAL COMPETENCIES:
              </div>
              <div className="space-y-1.5 pt-1">
                <p><span className="text-cyan-400 font-semibold w-28 inline-block">Languages:</span> TypeScript, JavaScript, Python, Solidity, Kotlin, C</p>
                <p><span className="text-cyan-400 font-semibold w-28 inline-block">Frontend:</span> Next.js 15, React 19, TailwindCSS v4, GSAP, WebGL</p>
                <p><span className="text-cyan-400 font-semibold w-28 inline-block">Trading/Algo:</span> MetaTrader 5, Walk-Forward Optimization, Monte Carlo Risk</p>
                <p><span className="text-cyan-400 font-semibold w-28 inline-block">Systems/Web3:</span> Viem, Web3.js, Docker, Git, Linux CLI, Android SDK</p>
              </div>
            </div>
          ),
        })
        break

      case 'projects':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="text-zinc-300 font-mono text-xs sm:text-sm leading-relaxed p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-2">
              <div className="text-emerald-400 font-bold pb-1 border-b border-zinc-800/80">
                ACTIVE CREATIONS & REPOSITORIES:
              </div>
              <div className="space-y-1.5 pt-1">
                <p>
                  <span className="text-emerald-400 font-bold">[01] LastEdge</span> — Quantitative MT5 Algorithmic Trading Platform
                </p>
                <p>
                  <span className="text-cyan-400 font-bold">[02] Millionaire Sharks</span> — Web3 Community Portal (millionairesharks.com)
                </p>
                <p>
                  <span className="text-purple-400 font-bold">[03] SpotifyUI</span> — Android Distraction-Free MP3 Player Revamp
                </p>
              </div>
              <div className="pt-2 text-emerald-400 flex items-center gap-2">
                <span className="animate-pulse">›</span>
                <span>Opening holographic project deck below...</span>
              </div>
            </div>
          ),
        })
        if (onExploreProjects) {
          setTimeout(() => onExploreProjects(), 200)
        }
        break

      case 'socials':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="text-zinc-300 font-mono text-xs sm:text-sm leading-relaxed p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1.5">
              <div className="text-emerald-400 font-bold pb-1 border-b border-zinc-800/80">
                CONNECTED SOCIAL CHANNELS:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-1">
                <p><span className="text-zinc-500 w-20 inline-block">instagram:</span> <a href="https://instagram.com/imlast999" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">@imlast999</a></p>
                <p><span className="text-zinc-500 w-20 inline-block">twitter:</span> <a href="https://twitter.com/imlast999" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">@imlast999</a></p>
                <p><span className="text-zinc-500 w-20 inline-block">tiktok:</span> <a href="https://tiktok.com/@imlast999_" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">@imlast999_</a></p>
                <p><span className="text-zinc-500 w-20 inline-block">telegram:</span> <a href="https://t.me/imlast999" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">t.me/imlast999</a></p>
                <p><span className="text-zinc-500 w-20 inline-block">github:</span> <a href="https://github.com/imlast999" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">github.com/imlast999</a></p>
                <p><span className="text-zinc-500 w-20 inline-block">twitch:</span> <a href="https://twitch.tv/imlast999" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">twitch.tv/imlast999</a></p>
                <p><span className="text-zinc-500 w-20 inline-block">ethereum:</span> <span className="text-zinc-300">0x223204...DE13f</span></p>
                <p><span className="text-zinc-500 w-20 inline-block">spotify:</span> <a href="https://open.spotify.com/user/31ezp7nbkqtopvtodymrdipbr22m" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">open.spotify.com</a></p>
                <p><span className="text-zinc-500 w-20 inline-block">axiom:</span> <a href="https://axiom.trade/@imlast999" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">axiom.trade/@imlast999</a></p>
              </div>
            </div>
          ),
        })
        break

      case 'contact':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="text-zinc-300 font-mono text-xs sm:text-sm leading-relaxed p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1.5">
              <div className="text-emerald-400 font-bold pb-1 border-b border-zinc-800/80">
                DIRECT COMMUNICATIONS:
              </div>
              <div className="space-y-1 pt-1">
                <p><span className="text-zinc-500 w-24 inline-block">Email:</span> <a href="mailto:lxstbrexthe@gmail.com" className="text-emerald-400 hover:underline">lxstbrexthe@gmail.com</a></p>
                <p><span className="text-zinc-500 w-24 inline-block">Telegram:</span> <a href="https://t.me/imlast999" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">@imlast999</a></p>
                <p><span className="text-zinc-500 w-24 inline-block">Twitter/X:</span> <a href="https://twitter.com/imlast999" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">@imlast999</a></p>
              </div>
            </div>
          ),
        })
        break

      case 'history':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="text-zinc-300 font-mono text-xs sm:text-sm leading-relaxed space-y-1 py-1">
              <div className="text-zinc-500 border-b border-zinc-800/80 pb-1">COMMAND HISTORY:</div>
              {commandHistory.length === 0 ? (
                <p className="text-zinc-500">No commands in session history.</p>
              ) : (
                commandHistory.map((c, i) => (
                  <p key={i}>
                    <span className="text-zinc-500 inline-block w-8">{i + 1}</span>
                    <span className="text-emerald-400">{c}</span>
                  </p>
                ))
              )}
            </div>
          ),
        })
        break

      case 'sudo':
      case 'sudo su':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'error',
          content: (
            <div className="text-zinc-300 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
              [sudo] password for visitor: **********
              {'\n'}
              <span className="text-red-400">zsh: permission denied: visitor is not in the sudoers configuration.</span>
            </div>
          ),
        })
        break

      case 'uname':
      case 'uname -a':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="text-zinc-300 font-mono text-xs sm:text-sm">
              Linux imlast999-station 6.8.0-void-space x86_64 GNU/Linux
            </div>
          ),
        })
        break

      case 'ls':
      case 'ls -la':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="text-zinc-300 font-mono text-xs sm:text-sm flex flex-wrap gap-4 py-1">
              <span className="text-cyan-400 font-bold">about.txt</span>
              <span className="text-cyan-400 font-bold">contact.md</span>
              <span className="text-emerald-400 font-bold">projects/</span>
              <span className="text-zinc-400">setup.log</span>
              <span className="text-amber-400 font-bold">skills.json</span>
            </div>
          ),
        })
        break

      case 'cat about.txt':
        executeCommand('about')
        return

      case 'cat setup.log':
        executeCommand('setup')
        return

      case 'cat contact.md':
        executeCommand('contact')
        return

      case 'cat skills.json':
        executeCommand('skills')
        return

      case 'matrix':
        setIsMatrixRunning(true)
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'matrix',
          content: (
            <div className="text-emerald-400 font-mono text-xs leading-tight select-none py-1 space-y-1">
              <p>[matrix] initializing stream sequence...</p>
              <p className="text-emerald-500 font-bold tracking-widest">
                01001001 01001100 01000001 01010011 01010100 00111001 00111001 00111001
              </p>
              <p className="text-emerald-300">
                01110110 01101111 01101001 01100100 00101101 01110011 01110000 01100001 01100011
              </p>
              <p className="text-white font-bold">wake up, Neo... the Matrix has you.</p>
              <p className="text-emerald-500">[matrix] stream complete.</p>
            </div>
          ),
        })
        setTimeout(() => {
          setIsMatrixRunning(false)
        }, 2000)
        break

      case 'clear':
        setHistory([])
        setInputVal('')
        return

      default:
        newHistory.push({
          id: `err-${Date.now()}`,
          type: 'error',
          content: (
            <div className="text-red-400 font-mono text-xs sm:text-sm">
              zsh: command not found: <span className="text-white font-bold">{rawCmd}</span>. Type <span className="text-emerald-400 font-bold">help</span> to view commands.
            </div>
          ),
        })
        break
    }

    setHistory(newHistory)
    setInputVal('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeCommand(inputVal)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ctrl + L or Cmd + K to clear terminal screen
    if ((e.ctrlKey && e.key.toLowerCase() === 'l') || (e.metaKey && e.key.toLowerCase() === 'k')) {
      e.preventDefault()
      setHistory([])
      setInputVal('')
      return
    }

    // Arrow Up (navigate backward through command history)
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length === 0) return
      const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIdx)
      setInputVal(commandHistory[nextIdx] || '')
      return
    }

    // Arrow Down (navigate forward through command history)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const nextIdx = historyIndex + 1
      if (nextIdx >= commandHistory.length) {
        setHistoryIndex(-1)
        setInputVal('')
      } else {
        setHistoryIndex(nextIdx)
        setInputVal(commandHistory[nextIdx])
      }
      return
    }

    // Tab (command auto-completion)
    if (e.key === 'Tab') {
      e.preventDefault()
      const prefix = inputVal.trim().toLowerCase()
      if (!prefix) return
      const matches = AVAILABLE_COMMANDS.filter((c) => c.startsWith(prefix))
      if (matches.length === 1) {
        setInputVal(matches[0])
      } else if (matches.length > 1) {
        setHistory((prev) => [
          ...prev,
          {
            id: `in-${Date.now()}`,
            type: 'input',
            command: inputVal,
          },
          {
            id: `out-${Date.now()}`,
            type: 'output',
            content: (
              <div className="text-zinc-400 font-mono text-xs flex flex-wrap gap-4 py-1">
                {matches.map((m) => (
                  <span key={m} className="text-emerald-400 font-bold">{m}</span>
                ))}
              </div>
            ),
          },
        ])
      }
      return
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Terminal Window with Subtle Cyber Neon Glow */}
      <div className="relative rounded-xl bg-[#08080c]/95 border border-zinc-700/80 shadow-[0_0_40px_rgba(16,185,129,0.08),0_0_2px_rgba(16,185,129,0.3),0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl overflow-hidden ring-1 ring-white/5">
        
        {/* Subtle CRT Scanlines Overlay */}
        <div className="terminal-scanlines pointer-events-none absolute inset-0 z-20 opacity-30 mix-blend-overlay" />

        {/* Ambient Top Light Line */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950/90 border-b border-zinc-800/90 select-none relative z-30">
          {/* macOS Style Traffic Dots */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-[0_0_8px_rgba(255,95,86,0.3)]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-[0_0_8px_rgba(255,189,46,0.3)]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-[0_0_8px_rgba(39,201,63,0.3)]" />
          </div>

          {/* Terminal Title */}
          <div className="text-xs font-mono text-zinc-300 flex items-center gap-1.5 font-medium">
            <span className="text-emerald-400">imlast999@is-a.dev</span>
            <span className="text-zinc-600">:</span>
            <span className="text-cyan-400">~</span>
            <span className="text-zinc-500">(zsh)</span>
          </div>

          {/* Shell Status Tag */}
          <div className="text-right text-[11px] font-mono text-emerald-400/80 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>online</span>
          </div>
        </div>

        {/* Terminal Output Body */}
        <div
          ref={contentBodyRef}
          onClick={() => inputRef.current?.focus()}
          className="p-4 sm:p-5 font-mono text-xs sm:text-sm min-h-[280px] max-h-[460px] overflow-y-auto space-y-3 cursor-text bg-[#07070a]/95 relative z-10"
        >
          {history.map((item) => (
            <div key={item.id} className="space-y-1">
              {item.type === 'input' && (
                <div className="flex items-center gap-2 text-zinc-300">
                  <span className="text-emerald-400 font-bold whitespace-nowrap">imlast999@is-a.dev ~ %</span>
                  <span className="text-white font-medium">{item.command}</span>
                </div>
              )}
              {item.content && <div className="pl-0">{item.content}</div>}
            </div>
          ))}

          {/* Active Input Line with authentic blinking block cursor */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1.5">
            <span className="text-emerald-400 font-bold whitespace-nowrap">
              imlast999@is-a.dev ~ %
            </span>
            <div className="flex-1 flex items-center relative">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder=""
                className="w-full bg-transparent border-none outline-none text-white font-mono text-xs sm:text-sm focus:ring-0 p-0"
                autoCapitalize="none"
                autoComplete="off"
                spellCheck="false"
                autoFocus={false}
              />
              {/* Terminal realistic blinking cursor indicator at end of prompt */}
              <span className="animate-terminal-cursor w-2 h-4 bg-emerald-400 inline-block ml-1 shadow-[0_0_8px_rgba(52,211,153,0.8)] pointer-events-none" />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
