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

export default function Terminal({ onExploreProjects }: TerminalProps) {
  const [inputVal, setInputVal] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'welcome-1',
      type: 'output',
      content: (
        <div className="text-zinc-400 space-y-1">
          <p className="text-emerald-400 font-semibold">
            imlast999 OS v2.4.0 [x86_64-void-space]
          </p>
          <p className="text-zinc-500">
            Type <span className="text-emerald-300 font-bold">help</span> to view available commands.
          </p>
        </div>
      ),
    },
  ])
  const [isMatrixRunning, setIsMatrixRunning] = useState(false)
  const terminalBodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll ONLY the inside of the terminal container on new output (without moving the page viewport)
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight
    }
  }, [history, isMatrixRunning])

  const executeCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim().toLowerCase()
    if (!cmd) return

    const newHistory: HistoryItem[] = [
      ...history,
      {
        id: `in-${Date.now()}`,
        type: 'input',
        command: rawCmd.trim(),
      },
    ]

    switch (cmd) {
      case 'help':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="space-y-1.5 text-zinc-300">
              <p className="text-emerald-400 font-semibold mb-1">
                Available Commands:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>
                  <span className="text-emerald-300 font-bold">about</span>
                  <span className="text-zinc-500"> - who is imlast999</span>
                </div>
                <div>
                  <span className="text-emerald-300 font-bold">setup</span>
                  <span className="text-zinc-500"> - battle station & specs</span>
                </div>
                <div>
                  <span className="text-emerald-300 font-bold">skills</span>
                  <span className="text-zinc-500"> - dev stack & languages</span>
                </div>
                <div>
                  <span className="text-emerald-300 font-bold">projects</span>
                  <span className="text-zinc-500"> - featured creations</span>
                </div>
                <div>
                  <span className="text-emerald-300 font-bold">socials</span>
                  <span className="text-zinc-500"> - quick link directory</span>
                </div>
                <div>
                  <span className="text-emerald-300 font-bold">contact</span>
                  <span className="text-zinc-500"> - direct message channels</span>
                </div>
                <div>
                  <span className="text-emerald-300 font-bold">matrix</span>
                  <span className="text-zinc-500"> - digital rain simulation</span>
                </div>
                <div>
                  <span className="text-emerald-300 font-bold">clear</span>
                  <span className="text-zinc-500"> - wipe console screen</span>
                </div>
                <div>
                  <span className="text-emerald-300 font-bold">sudo</span>
                  <span className="text-zinc-500"> - root privileges</span>
                </div>
              </div>
            </div>
          ),
        })
        break

      case 'about':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="space-y-2 text-zinc-300 text-xs sm:text-sm">
              <p className="text-white font-medium">
                Hey! I'm <span className="text-emerald-400">imlast999</span>.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Developer, gamer & crypto explorer building in the digital void.
                Obsessed with high-performance minimalist aesthetics, creative web
                animations, and quantitative systems.
              </p>
              <p className="text-zinc-500">
                Location: <span className="text-zinc-300">Cyberspace / Earth</span>
                {' · '}
                Domain: <span className="text-emerald-400">imlast999.is-a.dev</span>
              </p>
            </div>
          ),
        })
        break

      case 'setup':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="space-y-1.5 text-zinc-300 text-xs sm:text-sm">
              <p className="text-emerald-400 font-semibold mb-1">
                Hardware & Workspace Rig:
              </p>
              <ul className="space-y-1 text-zinc-400">
                <li>
                  <span className="text-zinc-500 font-mono">CPU:</span> 12th Gen Intel(R) Core(TM) i5-12400F
                </li>
                <li>
                  <span className="text-zinc-500 font-mono">GPU:</span> NVIDIA GeForce RTX 4060 Ti
                </li>
                <li>
                  <span className="text-zinc-500 font-mono">RAM:</span> 32 GB DDR4
                </li>
                <li>
                  <span className="text-zinc-500 font-mono">Storage:</span> WD Blue SN580 1TB NVMe SSD
                </li>
                <li>
                  <span className="text-zinc-500 font-mono">OS:</span> Windows 11 Pro
                </li>
              </ul>
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
            <div className="space-y-2 text-zinc-300 text-xs sm:text-sm">
              <p className="text-emerald-400 font-semibold">
                Tech Stack & Capabilities:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-400">
                <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                  <span className="text-white font-medium block mb-0.5">Frontend & UI</span>
                  <span className="text-zinc-400 text-xs">
                    Next.js 15, React 19, TypeScript, TailwindCSS v4, GSAP Animations
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                  <span className="text-white font-medium block mb-0.5">Quantitative & Algo</span>
                  <span className="text-zinc-400 text-xs">
                    MetaTrader 5, Python, Strategy Backtesting, Monte Carlo Simulation
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                  <span className="text-white font-medium block mb-0.5">Web3 & Systems</span>
                  <span className="text-zinc-400 text-xs">
                    Ethereum, EVM Chains, Smart Contracts, Node.js, Linux CLI
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                  <span className="text-white font-medium block mb-0.5">Mobile & UX</span>
                  <span className="text-zinc-400 text-xs">
                    Android UI Customization, Minimalist Design, Audio Player Architecture
                  </span>
                </div>
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
            <div className="space-y-2 text-zinc-300 text-xs sm:text-sm">
              <p className="text-emerald-400 font-semibold">
                Navigating to Project Showcase:
              </p>
              <p className="text-zinc-400">
                Scrolling down to holographic project cards...
              </p>
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
            <div className="space-y-1.5 text-zinc-300 text-xs sm:text-sm">
              <p className="text-emerald-400 font-semibold mb-1">
                Connected Networks:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 font-mono text-xs">
                <a
                  href="https://github.com/imlast999"
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-300 hover:text-white underline decoration-zinc-700"
                >
                  github.com/imlast999
                </a>
                <a
                  href="https://twitter.com/imlast999"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 hover:text-sky-300 underline decoration-sky-800"
                >
                  twitter/imlast999
                </a>
                <a
                  href="https://instagram.com/imlast999"
                  target="_blank"
                  rel="noreferrer"
                  className="text-pink-400 hover:text-pink-300 underline decoration-pink-800"
                >
                  instagram/imlast999
                </a>
                <a
                  href="https://tiktok.com/@imlast999_"
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-400 hover:text-teal-300 underline decoration-teal-800"
                >
                  tiktok/@imlast999_
                </a>
                <a
                  href="https://t.me/imlast999"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline decoration-blue-800"
                >
                  telegram/imlast999
                </a>
                <a
                  href="https://open.spotify.com/user/31ezp7nbkqtopvtodymrdipbr22m"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 underline decoration-emerald-800"
                >
                  spotify/imlast999
                </a>
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
            <div className="space-y-1 text-zinc-300 text-xs sm:text-sm">
              <p className="text-emerald-400 font-semibold mb-1">
                Reach Out:
              </p>
              <p>
                <span className="text-zinc-500 font-mono">Email:</span>{' '}
                <a
                  href="mailto:lxstbrexthe@gmail.com"
                  className="text-emerald-400 hover:underline"
                >
                  lxstbrexthe@gmail.com
                </a>
              </p>
              <p>
                <span className="text-zinc-500 font-mono">Telegram:</span>{' '}
                <a
                  href="https://t.me/imlast999"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 hover:underline"
                >
                  @imlast999
                </a>
              </p>
              <p>
                <span className="text-zinc-500 font-mono">Twitter DM:</span>{' '}
                <a
                  href="https://twitter.com/imlast999"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 hover:underline"
                >
                  @imlast999
                </a>
              </p>
            </div>
          ),
        })
        break

      case 'sudo':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'error',
          content: (
            <div className="text-amber-400 text-xs font-mono">
              [sudo] password for visitor: **********
              <br />
              <span className="text-red-400">
                imlast999 is not in the sudoers file. This incident has been logged.
              </span>
            </div>
          ),
        })
        break

      case 'matrix':
        setIsMatrixRunning(true)
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'matrix',
          content: (
            <div className="text-emerald-500 font-mono text-[11px] leading-tight select-none py-1 animate-pulse">
              [SYSTEM] Breaching the Matrix simulation...
              <br />
              01001001 01001101 01001100 01000001 01010011 01010100 00111001 00111001 00111001
              <br />
              Wake up, Neo... The Matrix has you.
            </div>
          ),
        })
        setTimeout(() => {
          setIsMatrixRunning(false)
        }, 3200)
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
            <div className="text-red-400/90 text-xs font-mono">
              command not found: <span className="text-white">{rawCmd}</span>. Type{' '}
              <span className="text-emerald-300 font-bold">help</span> to view available commands.
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

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Terminal Window */}
      <div className="relative rounded-2xl bg-[#09090d]/90 border border-zinc-800/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-zinc-700/80">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/80 border-b border-zinc-800/80 select-none">
          {/* macOS Style Traffic Dots */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />
          </div>

          {/* Terminal Title */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <svg
              className="w-3.5 h-3.5 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>imlast999@is-a.dev: ~ (zsh)</span>
          </div>

          {/* Live Online Badge */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">online</span>
          </div>
        </div>

        {/* Terminal Content Body */}
        <div
          ref={terminalBodyRef}
          onClick={() => inputRef.current?.focus()}
          className="p-4 sm:p-5 font-mono text-xs sm:text-sm min-h-[260px] max-h-[440px] overflow-y-auto space-y-3 cursor-text"
        >
          {history.map((item) => (
            <div key={item.id} className="space-y-1">
              {item.type === 'input' && (
                <div className="flex items-center gap-2 text-zinc-400">
                  <span className="text-emerald-400 font-bold">imlast999:~$</span>
                  <span className="text-white font-medium">{item.command}</span>
                </div>
              )}
              {item.content && <div className="pl-0 sm:pl-4">{item.content}</div>}
            </div>
          ))}

          {/* Active Input Line */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
            <span className="text-emerald-400 font-bold whitespace-nowrap">
              imlast999:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="type a command... (e.g. help)"
              className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs sm:text-sm placeholder:text-zinc-600 focus:ring-0 p-0"
              autoCapitalize="none"
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        </div>
      </div>
    </div>
  )
}
