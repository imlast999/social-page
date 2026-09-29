'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const EVM_ADDRESS = '0x2232047f31888e6EAdC21d920E8FC4BD3ccDE13f'
const ABSTRACT_PROFILE = 'https://portal.abs.xyz/profile/0x73c83FD4803095f2da1D2b4C74D6332abbd100AD'
const AXIOM_PROFILE = 'https://axiom.trade/@imlast999'
const SHARKS_URL = 'https://millionairesharks.com'
const FOMO_URL = 'https://fomo.family/r/imlast999'
const L0_SCAN_URL = `https://layerzeroscan.com/address/${EVM_ADDRESS}`

const PROTOCOL_ITEMS = [
  {
    id: 'axiom',
    title: 'Axiom',
    sub: 'Professional memecoin trading platform with granular fee customization and limit orders for micro-portfolios.',
    handle: '@imlast999',
    url: AXIOM_PROFILE,
    status: 'PRO TRADING',
    tagColor: 'bg-emerald-400 text-black',
    actionLabel: 'OPEN',
  },
  {
    id: 'fomo',
    title: 'FOMO Social',
    sub: 'Social memecoin trading: real-time swap alert feeds and creator investment theses on tracked tokens.',
    handle: 'fomo.family/r/imlast999',
    url: FOMO_URL,
    status: 'SOCIAL TRADING',
    tagColor: 'bg-fuchsia-400 text-black',
    actionLabel: 'OPEN',
  },
  {
    id: 'abstract',
    title: 'Abstract L2',
    sub: 'EVM Layer 2 by Pudgy Penguins (AGW). Holding Dreamilio NFT & $PENGU for ecosystem qualification.',
    handle: '0x73c8...100AD',
    url: ABSTRACT_PROFILE,
    status: 'PUDGY L2 // AGW',
    tagColor: 'bg-cyan-400 text-black',
    actionLabel: 'PORTAL',
  },
  {
    id: 'sharks',
    title: 'Millionaire Sharks',
    sub: 'Official Web3 syndicate ecosystem: EVM whitelist engine, 10-character lore universe, 60 FPS Canvas arcade runner ("Bankscape"), and IP-locked leaderboard.',
    handle: 'millionairesharks.com',
    url: SHARKS_URL,
    status: 'CO-FOUNDER // ARCADE',
    tagColor: 'bg-amber-400 text-black',
    actionLabel: 'PORTAL',
  },
  {
    id: 'layerzero',
    title: 'LayerZero Scan',
    sub: 'Omnichain transfer registry, cross-chain messaging telemetry, and multi-network bridge explorer.',
    handle: 'layerzeroscan.com',
    url: L0_SCAN_URL,
    status: 'OMNIX SCANNER',
    tagColor: 'bg-zinc-200 text-black',
    actionLabel: 'SCAN',
  },
]

const L2_SCANNERS = [
  { name: 'BaseScan', url: `https://basescan.org/address/${EVM_ADDRESS}` },
  { name: 'OP Etherscan', url: `https://optimistic.etherscan.io/address/${EVM_ADDRESS}` },
  { name: 'DeBank', url: `https://debank.com/profile/${EVM_ADDRESS}` },
  { name: 'Etherscan', url: `https://etherscan.io/address/${EVM_ADDRESS}` },
]

export default function Web3Page() {
  const [copied, setCopied] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    setIsVisible(true)

    // IntersectionObserver for scroll fade-in
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0')
            entry.target.classList.remove('opacity-0', 'translate-y-4')
          }
        })
      },
      { threshold: 0.1 }
    )

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(EVM_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen w-full bg-[#08080c] text-zinc-100 select-none relative overflow-x-hidden font-silkscreen antialiased pb-16">
      {/* 16-Bit Retro Pixel Grid Texture */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-cyber-grid opacity-25" />
      
      {/* Subtle Monochrome Ambient Glow */}
      <div className="pointer-events-none fixed top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-zinc-700/10 rounded-full blur-[140px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        
        {/* ======================================================== */}
        {/* 16-BIT RETRO HEADER (LIKE HOODBITS_)                     */}
        {/* ======================================================== */}
        <header className="flex items-center justify-between border-b-2 border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            {/* 16-Bit Low-Res Favicon Icon */}
            <div className="w-8 h-8 rounded-none bg-black border-2 border-zinc-300 flex items-center justify-center pixel-shadow-sm overflow-hidden p-0.5">
              <img
                src="/favicon.ico"
                alt="imlast999 pixel icon"
                width={24}
                height={24}
                className="w-full h-full object-contain [image-rendering:pixelated]"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            
            <span className="font-pixel text-sm sm:text-base tracking-wider text-white">
              IMLAST999
            </span>
          </div>

          <Link
            href="/"
            className="px-3.5 py-1.5 bg-black border-2 border-zinc-300 text-white font-pixel text-[10px] tracking-wider pixel-button hover:bg-zinc-200 hover:text-black transition-colors"
          >
            RETURN [↵]
          </Link>
        </header>

        {/* ======================================================== */}
        {/* 16-BIT HERO INTRO                                        */}
        {/* ======================================================== */}
        <section
          ref={(el) => { sectionRefs.current[0] = el }}
          className={`space-y-2 transition-all duration-500 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="inline-block text-[10px] font-pixel text-zinc-400 uppercase tracking-widest bg-zinc-900 border border-zinc-800 px-2.5 py-1">
            ON-CHAIN DIRECTORY // 16-BIT
          </div>

          <h1 className="font-pixel text-2xl sm:text-3xl text-white leading-tight uppercase pt-1">
            Web3 Vault.
          </h1>

          <p className="text-xs text-zinc-400 font-mono max-w-xl leading-relaxed">
            Multi-chain identity, smart contracts, Layer 2 verified handles, and quantitative endpoints.
          </p>
        </section>

        {/* ======================================================== */}
        {/* MAIN 16-BIT HOODBITS-STYLE CARD CONTAINER               */}
        {/* ======================================================== */}
        <section
          ref={(el) => { sectionRefs.current[1] = el }}
          className={`border-2 border-zinc-200 bg-[#0e0f14] p-5 sm:p-7 space-y-6 pixel-shadow-white transition-all duration-500 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Root Address Display inside container */}
          <div className="p-3.5 bg-black border-2 border-zinc-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pixel-shadow-sm">
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] font-pixel text-zinc-400 uppercase tracking-widest block">
                EVM & L2 ROOT WALLET
              </span>
              <span className="text-xs sm:text-sm font-mono text-zinc-200 truncate block select-all">
                {EVM_ADDRESS}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className={`px-4 py-2 border-2 border-black font-pixel text-xs tracking-wider pixel-button transition-all cursor-pointer shrink-0 ${
                copied
                  ? 'bg-emerald-400 text-black font-bold'
                  : 'bg-zinc-200 text-black hover:bg-white'
              }`}
            >
              {copied ? 'COPIED! ✓' : 'COPY [⧉]'}
            </button>
          </div>

          {/* Protocol Items List */}
          <div className="space-y-4 pt-2">
            {PROTOCOL_ITEMS.map((item, index) => (
              <div
                key={item.id}
                ref={(el) => { sectionRefs.current[index + 2] = el }}
                className="pt-4 border-t border-zinc-800 first:border-t-0 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group transition-all duration-300 opacity-100"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-pixel text-xs sm:text-sm text-white group-hover:text-zinc-200 transition-colors">
                      {item.title}
                    </h3>
                    <span className={`text-[9px] font-pixel px-1.5 py-0.5 border border-black ${item.tagColor}`}>
                      {item.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">
                    {item.sub}
                  </p>

                  <span className="text-[10px] text-zinc-500 font-mono block">
                    {item.handle}
                  </span>
                </div>

                {/* 16-Bit Action Button [OPEN ↗] */}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-zinc-200 hover:bg-white text-black border-2 border-black font-pixel text-xs tracking-wider pixel-button flex items-center justify-center gap-1.5 self-start sm:self-center shrink-0 cursor-pointer"
                >
                  <span>{item.actionLabel}</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* COMPACT L2 EXPLORERS SCROLL ROW                          */}
        {/* ======================================================== */}
        <section
          ref={(el) => { sectionRefs.current[8] = el }}
          className={`space-y-3 transition-all duration-500 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-pixel text-[10px] uppercase tracking-wider">
              L2 NETWORK EXPLORERS
            </span>
            <span className="font-mono text-[11px] text-zinc-500">4 verified</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {L2_SCANNERS.map((sc) => (
              <a
                key={sc.name}
                href={sc.url}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-[#0d0e14] border-2 border-zinc-800 hover:border-zinc-400 text-center space-y-1 pixel-button block transition-colors"
              >
                <span className="font-pixel text-[10px] text-white block">
                  {sc.name}
                </span>
                <span className="text-[9px] text-zinc-500 font-mono block">
                  SCANNER ↗
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-4 border-t-2 border-dashed border-zinc-800 text-center font-pixel text-[9px] text-zinc-600 tracking-wider">
          <p>IMLAST999 // 16-BIT ON-CHAIN VAULT // {new Date().getFullYear()}</p>
        </footer>
      </div>
    </main>
  )
}
