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
        <div className="text-zinc-400 font-mono text-xs sm:text-sm leading-relaxed">
          <p className="text-zinc-500">Last login: {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} on ttys001</p>
          <p className="text-zinc-400">zsh 5.9 (x86_64-void-space)</p>
          <p className="text-zinc-500 mt-1">Type <span className="text-emerald-400">help</span> for available commands.</p>
        </div>
      ),
    },
  ])
  const [isMatrixRunning, setIsMatrixRunning] = useState(false)
  const contentBodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll ONLY the inner terminal viewport to bottom on new output (does NOT move the browser window)
  useEffect(() => {
    if (contentBodyRef.current) {
      contentBodyRef.current.scrollTop = contentBodyRef.current.scrollHeight
    }
  }, [history, isMatrixRunning])

  const executeCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim()
    const lowerCmd = cmd.toLowerCase()
    if (!cmd) return

    const newHistory: HistoryItem[] = [
      ...history,
      {
        id: `in-${Date.now()}`,
        type: 'input',
        command: cmd,
      },
    ]

    switch (lowerCmd) {
      case 'help':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="text-zinc-300 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
              <span className="text-zinc-400">zsh: available commands:</span>
              {'\n'}
              {'  '}
              <span className="text-emerald-400 font-bold">about</span>
              {'       display developer profile and summary\n  '}
              <span className="text-emerald-400 font-bold">setup</span>
              {'       print hardware specs & workstation rig\n  '}
              <span className="text-emerald-400 font-bold">skills</span>
              {'      list languages, frameworks and tools\n  '}
              <span className="text-emerald-400 font-bold">projects</span>
              {'    navigate to featured project showcase\n  '}
              <span className="text-emerald-400 font-bold">socials</span>
              {'     list connected social endpoints\n  '}
              <span className="text-emerald-400 font-bold">contact</span>
              {'     show direct communication channels\n  '}
              <span className="text-emerald-400 font-bold">whoami</span>
              {'      print current user identity\n  '}
              <span className="text-emerald-400 font-bold">uname</span>
              {'       print system kernel and architecture\n  '}
              <span className="text-emerald-400 font-bold">ls</span>
              {'          list directory contents\n  '}
              <span className="text-emerald-400 font-bold">matrix</span>
              {'      run digital rain terminal stream\n  '}
              <span className="text-emerald-400 font-bold">clear</span>
              {'       wipe terminal display\n  '}
              <span className="text-emerald-400 font-bold">sudo</span>
              {'        execute command with root privileges'}
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
            <div className="text-zinc-300 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
              <span className="text-zinc-500">user:     </span>imlast999{'\n'}
              <span className="text-zinc-500">role:     </span>builder / creative developer / crypto explorer{'\n'}
              <span className="text-zinc-500">domain:   </span>imlast999.is-a.dev{'\n'}
              <span className="text-zinc-500">focus:    </span>quantitative systems (LastEdge), Web3 portals, custom UI{'\n'}
              <span className="text-zinc-500">bio:      </span>crafting high-performance systems and algorithmic software in the digital void.
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
              <span className="text-zinc-500">OS:       </span>Windows 11 Pro [Version 10.0.22631]{'\n'}
              <span className="text-zinc-500">Host:     </span>imlast999-station{'\n'}
              <span className="text-zinc-500">Kernel:   </span>x86_64-void{'\n'}
              <span className="text-zinc-500">CPU:      </span>12th Gen Intel(R) Core(TM) i5-12400F (12) @ 4.40GHz{'\n'}
              <span className="text-zinc-500">GPU:      </span>NVIDIA GeForce RTX 4060 Ti 8GB{'\n'}
              <span className="text-zinc-500">Memory:   </span>32768MB (32 GB DDR4){'\n'}
              <span className="text-zinc-500">Disk:     </span>WD Blue SN580 1TB NVMe SSD (PCIe 4.0){'\n'}
              <span className="text-zinc-500">Shell:    </span>zsh 5.9
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
              <span className="text-zinc-500">LANGUAGES:    </span>TypeScript, JavaScript, Python, Solidity, Kotlin, C{'\n'}
              <span className="text-zinc-500">FRAMEWORKS:   </span>Next.js 15, React 19, TailwindCSS v4, GSAP, Viem{'\n'}
              <span className="text-zinc-500">QUANT & ALGO: </span>MetaTrader 5, Strategy Backtesting, Monte Carlo Simulation{'\n'}
              <span className="text-zinc-500">SYSTEMS:      </span>Linux CLI, Git, Vercel CI/CD, Docker, Android UI/UX
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
              [2] Millionaire Sharks Web3 Community & NFT Portal (millionairesharks.com){'\n'}
              [3] SpotifyUI          Android MP3 Player UI Transformation{'\n\n'}
              <span className="text-emerald-400">navigating to project showcase section...</span>
            </div>
          ),
        })
        if (onExploreProjects) {
          setTimeout(() => onExploreProjects(), 250)
        }
        break

      case 'socials':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="text-zinc-300 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
              <span className="text-zinc-500">instagram  </span><a href="https://instagram.com/imlast999" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">https://instagram.com/imlast999</a>{'\n'}
              <span className="text-zinc-500">twitter    </span><a href="https://twitter.com/imlast999" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">https://twitter.com/imlast999</a>{'\n'}
              <span className="text-zinc-500">tiktok     </span><a href="https://tiktok.com/@imlast999_" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">https://tiktok.com/@imlast999_</a>{'\n'}
              <span className="text-zinc-500">telegram   </span><a href="https://t.me/imlast999" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">https://t.me/imlast999</a>{'\n'}
              <span className="text-zinc-500">twitch     </span><a href="https://twitch.tv/imlast999" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">https://twitch.tv/imlast999</a>{'\n'}
              <span className="text-zinc-500">spotify    </span><a href="https://open.spotify.com/user/31ezp7nbkqtopvtodymrdipbr22m" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">https://open.spotify.com/user/31ezp7...</a>{'\n'}
              <span className="text-zinc-500">steam      </span><a href="https://steamcommunity.com/id/imlast999" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">https://steamcommunity.com/id/imlast999</a>{'\n'}
              <span className="text-zinc-500">roblox     </span><a href="https://roblox.com/users/1193901121/profile" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">https://roblox.com/users/1193901121/profile</a>{'\n'}
              <span className="text-zinc-500">github     </span><a href="https://github.com/imlast999" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">https://github.com/imlast999</a>{'\n'}
              <span className="text-zinc-500">ethereum   </span>0x2232047f31888e6EAdC21d920E8FC4BD3ccDE13f{'\n'}
              <span className="text-zinc-500">abstract   </span><a href="https://portal.abs.xyz/profile/0x73c83FD4803095f2da1D2b4C74D6332abbd100AD" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">https://portal.abs.xyz/profile/0x73...</a>{'\n'}
              <span className="text-zinc-500">fomo       </span><a href="https://fomo.family/r/imlast999" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">https://fomo.family/r/imlast999</a>
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
              <span className="text-zinc-500">email:    </span><a href="mailto:lxstbrexthe@gmail.com" className="text-emerald-400 hover:underline">lxstbrexthe@gmail.com</a>{'\n'}
              <span className="text-zinc-500">telegram: </span><a href="https://t.me/imlast999" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">@imlast999 (t.me/imlast999)</a>{'\n'}
              <span className="text-zinc-500">twitter:  </span><a href="https://twitter.com/imlast999" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">@imlast999 (twitter.com/imlast999)</a>
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
            <div className="text-zinc-300 font-mono text-xs sm:text-sm">
              about.txt   contact.md   projects/   setup.log   skills.json
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
            <div className="text-emerald-400 font-mono text-xs leading-tight select-none py-1">
              [matrix] initializing stream sequence...{'\n'}
              01001001 01001101 01001100 01000001 01010011 01010100 00111001 00111001 00111001{'\n'}
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
            <div className="text-red-400 font-mono text-xs sm:text-sm">
              zsh: command not found: {rawCmd}. Type <span className="text-emerald-400 font-bold">help</span> to view commands.
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
      <div className="relative rounded-xl bg-[#08080c]/95 border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.85)] backdrop-blur-xl overflow-hidden">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950 border-b border-zinc-850 select-none">
          {/* macOS Style Traffic Dots */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block" />
          </div>

          {/* Terminal Title */}
          <div className="text-xs font-mono text-zinc-400">
            imlast999@is-a.dev: ~ (zsh)
          </div>

          {/* Empty spacer for alignment */}
          <div className="w-12 text-right text-[11px] font-mono text-zinc-600">
            zsh
          </div>
        </div>

        {/* Terminal Output Body */}
        <div
          ref={contentBodyRef}
          onClick={() => inputRef.current?.focus()}
          className="p-4 sm:p-5 font-mono text-xs sm:text-sm min-h-[260px] max-h-[440px] overflow-y-auto space-y-3 cursor-text bg-[#07070a]"
        >
          {history.map((item) => (
            <div key={item.id} className="space-y-1">
              {item.type === 'input' && (
                <div className="flex items-center gap-2 text-zinc-400">
                  <span className="text-emerald-400 font-bold">imlast999@is-a.dev ~ %</span>
                  <span className="text-white">{item.command}</span>
                </div>
              )}
              {item.content && <div className="pl-0">{item.content}</div>}
            </div>
          ))}

          {/* Active Input Line */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
            <span className="text-emerald-400 font-bold whitespace-nowrap">
              imlast999@is-a.dev ~ %
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder=""
              className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs sm:text-sm focus:ring-0 p-0"
              autoCapitalize="none"
              autoComplete="off"
              spellCheck="false"
              autoFocus={false}
            />
          </form>
        </div>
      </div>
    </div>
  )
}
