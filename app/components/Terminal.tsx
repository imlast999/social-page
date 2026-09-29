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
  'web3',
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
  const [isGodMode, setIsGodMode] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'welcome-1',
      type: 'output',
      content: (
        <div className="text-zinc-400 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
          Last login: {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} on ttys001{'\n'}
          zsh 5.9 (x86_64-void-space) — Type 'help' for available commands.
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
            <div className="text-zinc-300 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
              zsh: available commands:{'\n'}
              {'  '}about       developer profile and bio{'\n'}
              {'  '}setup       hardware specs and workstation rig{'\n'}
              {'  '}skills      technical competencies and stack{'\n'}
              {'  '}projects    featured applications and repos{'\n'}
              {'  '}socials     connected network endpoints{'\n'}
              {'  '}web3        open decentralized on-chain hub{'\n'}
              {'  '}contact     direct communication channels{'\n'}
              {'  '}whoami      print current user identity{'\n'}
              {'  '}uname       print system kernel and architecture{'\n'}
              {'  '}ls          list directory contents{'\n'}
              {'  '}matrix      digital stream simulation{'\n'}
              {'  '}history     view command history{'\n'}
              {'  '}clear       wipe terminal screen{'\n'}
              {'  '}sudo        execute with root privileges
            </div>
          ),
        })
        break

      case 'web3':
      case 'open web3':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="text-emerald-400 font-mono text-xs sm:text-sm whitespace-pre-wrap">
              [web3] accessing on-chain portal... redirecting to /web3
            </div>
          ),
        })
        setTimeout(() => {
          window.location.href = '/web3'
        }, 250)
        break

      case 'void':
      case 'enter void':
      case 'warp void':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="text-purple-400 font-mono text-xs sm:text-sm whitespace-pre-wrap">
              [void] initiating sub-quantum warp... entering /void adventure
            </div>
          ),
        })
        setTimeout(() => {
          window.location.href = '/void'
        }, 250)
        break

      case 'about':
      case 'whoami':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="text-zinc-300 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
              user:     imlast999{'\n'}
              role:     builder / creative developer / crypto explorer{'\n'}
              domain:   imlast999.is-a.dev{'\n'}
              focus:    quantitative systems (LastEdge), Web3 portals, mobile UI{'\n'}
              bio:      crafting high-performance systems and algorithmic software.
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
            <div className="text-zinc-300 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
              OS:       Windows 11 Pro [Version 10.0.22631]{'\n'}
              Host:     imlast999-station{'\n'}
              Kernel:   x86_64-void{'\n'}
              CPU:      12th Gen Intel(R) Core(TM) i5-12400F (12) @ 4.40GHz{'\n'}
              GPU:      NVIDIA GeForce RTX 4060 Ti 8GB{'\n'}
              Memory:   32768MB (32 GB DDR4){'\n'}
              Disk:     WD Blue SN580 1TB NVMe SSD (PCIe 4.0){'\n'}
              Shell:    zsh 5.9
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
            <div className="text-zinc-300 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
              LANGUAGES:    TypeScript, JavaScript, Python, Solidity, Kotlin, C{'\n'}
              FRAMEWORKS:   Next.js 15, React 19, TailwindCSS v4, GSAP, WebGL{'\n'}
              QUANT & ALGO: MetaTrader 5, Strategy Backtesting, Monte Carlo Simulation{'\n'}
              SYSTEMS:      Linux CLI, Git, Vercel CI/CD, Docker, Android SDK
            </div>
          ),
        })
        break

      case 'projects':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="text-zinc-300 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
              [1] LastEdge           Quantitative Trading Platform for MetaTrader 5{'\n'}
              [2] Millionaire Sharks Syndicate Web3 Hub & Arcade (millionairesharks.com){'\n'}
              [3] SpotifyUI          Android MP3 Player UI Transformation{'\n\n'}
              navigating to project showcase section...
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
            <div className="text-zinc-300 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
              instagram  https://instagram.com/imlast999{'\n'}
              twitter/x  https://x.com/imlast999{'\n'}
              tiktok     https://tiktok.com/@imlast999_{'\n'}
              telegram   https://t.me/imlast999{'\n'}
              twitch     https://twitch.tv/imlast999{'\n'}
              spotify    https://open.spotify.com/user/31ezp7nbkqtopvtodymrdipbr22m{'\n'}
              steam      https://steamcommunity.com/id/imlast999{'\n'}
              roblox     https://roblox.com/users/1193901121/profile{'\n'}
              github     https://github.com/imlast999{'\n'}
              ethereum   0x2232047f31888e6EAdC21d920E8FC4BD3ccDE13f{'\n'}
              abstract   https://portal.abs.xyz/profile/0x73c83FD4803095f2da1D2b4C74D6332abbd100AD{'\n'}
              fomo       https://fomo.family/r/imlast999{'\n'}
              axiom      https://axiom.trade/@imlast999
            </div>
          ),
        })
        break

      case 'contact':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="text-zinc-300 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
              email:    lxstbrexthe@gmail.com{'\n'}
              telegram: @imlast999 (https://t.me/imlast999){'\n'}
              twitter/x:  @imlast999 (https://x.com/imlast999)
            </div>
          ),
        })
        break

      case 'history':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="text-zinc-300 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
              {commandHistory.length === 0
                ? 'No commands in session history.'
                : commandHistory.map((c, i) => `  ${i + 1}  ${c}`).join('\n')}
            </div>
          ),
        })
        break

      case 'sudo void-root-999':
      case 'sudo void999':
      case 'sudo root':
        setIsGodMode(true)
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="text-emerald-400 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
              [ROOT ACCESS AUTHORIZED: MASTER OVERRIDE ACTIVE]{'\n'}
              All security safeguards dissolved. God Mode enabled.{'\n'}
              Welcome to the core terminal, Operator.
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
              [sudo] password for visitor: **********{'\n'}
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
            <div className="text-zinc-300 font-mono text-xs sm:text-sm whitespace-pre-wrap">
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
            <div className="text-zinc-300 font-mono text-xs sm:text-sm whitespace-pre-wrap">
              about.txt   contact.md   projects/   setup.log   skills.json   web3/
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
            <div className="text-emerald-400 font-mono text-xs whitespace-pre-wrap leading-tight select-none">
              [matrix] initializing stream sequence...{'\n'}
              01001001 01001100 01000001 01010011 01010100 00111001 00111001 00111001{'\n'}
              01110110 01101111 01101001 01100100 00101101 01110011 01110000 01100001 01100011{'\n'}
              wake up, Neo... the Matrix has you.{'\n'}
              [matrix] stream complete.
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
            <div className="text-zinc-300 font-mono text-xs sm:text-sm whitespace-pre-wrap">
              zsh: command not found: {rawCmd}
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
              <div className="text-zinc-400 font-mono text-xs whitespace-pre-wrap">
                {matches.join('   ')}
              </div>
            ),
          },
        ])
      }
      return
    }
  }

  const promptPrefix = isGodMode ? 'imlast999@is-a.dev [ROOT] #' : 'imlast999@is-a.dev ~ %'

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Terminal Window with Subtle Cyber Neon Glow */}
      <div className={`relative rounded-xl bg-[#08080c]/95 border ${
        isGodMode ? 'border-emerald-400/80 shadow-[0_0_60px_rgba(16,185,129,0.25)]' : 'border-zinc-700/80 shadow-[0_0_40px_rgba(16,185,129,0.08),0_0_2px_rgba(16,185,129,0.3),0_20px_60px_rgba(0,0,0,0.9)]'
      } backdrop-blur-2xl overflow-hidden ring-1 ring-white/5 transition-all duration-500`}>
        
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
            <span className={isGodMode ? 'text-emerald-300 font-bold' : 'text-emerald-400'}>
              imlast999@is-a.dev
            </span>
            <span className="text-zinc-600">:</span>
            <span className="text-cyan-400">{isGodMode ? '/root' : '~'}</span>
            <span className="text-zinc-500">({isGodMode ? 'godmode' : 'zsh'})</span>
          </div>

          {/* Shell Status Tag */}
          <div className="text-right text-[11px] font-mono text-emerald-400/80 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isGodMode ? 'ROOT OVERRIDE' : 'online'}</span>
          </div>
        </div>

        {/* Terminal Output Body */}
        <div
          ref={contentBodyRef}
          onClick={() => inputRef.current?.focus()}
          className="p-4 sm:p-5 font-mono text-xs sm:text-sm min-h-[280px] max-h-[460px] overflow-y-auto space-y-2 cursor-text bg-[#07070a]/95 relative z-10"
        >
          {history.map((item) => (
            <div key={item.id} className="space-y-0.5">
              {item.type === 'input' && (
                <div className="flex items-center gap-2 text-zinc-300">
                  <span className={`font-bold whitespace-nowrap select-none ${
                    isGodMode ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {promptPrefix}
                  </span>
                  <span className="text-white font-medium">{item.command}</span>
                </div>
              )}
              {item.content && <div className="pl-0">{item.content}</div>}
            </div>
          ))}

          {/* Active Input Line with authentic inline green block cursor */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
            <span className={`font-bold whitespace-nowrap select-none ${
              isGodMode ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {promptPrefix}
            </span>
            <div 
              className="flex-1 flex items-center relative cursor-text min-h-[20px]"
              onClick={() => inputRef.current?.focus()}
            >
              <span className="text-white whitespace-pre font-mono text-xs sm:text-sm">
                {inputVal}
              </span>
              {/* Authentic thick green block cursor right after the typed text */}
              <span className={`inline-block w-2.5 h-4 ${
                isGodMode ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
              } animate-terminal-cursor select-none shrink-0`} />
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                className="absolute inset-0 w-full h-full opacity-0 cursor-text pointer-events-auto"
                autoCapitalize="none"
                autoComplete="off"
                spellCheck="false"
                autoFocus
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
