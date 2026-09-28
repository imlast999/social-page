'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

const ETH_ADDRESS = '0x2232047f31888e6EAdC21d920E8FC4BD3ccDE13f'
const ABSTRACT_PROFILE = 'https://portal.abs.xyz/profile/0x73c83FD4803095f2da1D2b4C74D6332abbd100AD'
const AXIOM_PROFILE = 'https://axiom.trade/@imlast999'
const SHARKS_URL = 'https://millionairesharks.com'
const FOMO_URL = 'https://fomo.family/r/imlast999'

const ECOSYSTEM_PLATFORMS = [
  {
    id: 'axiom',
    title: 'Axiom Trade',
    category: 'Decentralized Trading & Analytics',
    description: 'Quantitative on-chain terminal and decentralized markets trading profile.',
    url: AXIOM_PROFILE,
    badge: 'ACTIVE TRADER',
    color: '#FFFFFF',
    glow: 'rgba(255, 255, 255, 0.18)',
  },
  {
    id: 'abstract',
    title: 'Abstract Portal',
    category: 'EVM L2 Consumer Chain',
    description: 'Consumer crypto on-chain identity, smart accounts and EVM ecosystem activity.',
    url: ABSTRACT_PROFILE,
    badge: 'LAYER 2',
    color: '#00FF88',
    glow: 'rgba(0, 255, 136, 0.22)',
  },
  {
    id: 'sharks',
    title: 'Millionaire Sharks Club',
    category: 'NFT & Community Ecosystem',
    description: 'Exclusive digital community portal, roadmap utility and Web3 portal architecture.',
    url: SHARKS_URL,
    badge: 'PRODUCTION',
    color: '#06B6D4',
    glow: 'rgba(6, 182, 212, 0.22)',
  },
  {
    id: 'fomo',
    title: 'FOMO Family',
    category: 'Crypto Social Network',
    description: 'Web3 social connectivity and decentralized creator referral network.',
    url: FOMO_URL,
    badge: 'COMMUNITY',
    color: '#F0F6FC',
    glow: 'rgba(240, 246, 252, 0.18)',
  },
]

export default function Web3Page() {
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(ETH_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <main className="min-h-screen w-full bg-[#050508] text-white select-none relative overflow-x-hidden font-sans">
      {/* Background Subtle Cyber Grid */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-cyber-grid opacity-30" />
      
      {/* Soft Ambient Aurora Lights */}
      <div className="pointer-events-none fixed -top-40 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px]" />
      <div className="pointer-events-none fixed top-1/2 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-12">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between border-b border-zinc-800/80 pb-6">
          <Link
            href="/"
            className="group flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            <span className="transition-transform group-hover:-translate-x-1 font-bold">←</span>
            <span>return to orbit</span>
          </Link>

          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MAINNET / VERIFIED</span>
          </div>
        </header>

        {/* Hero Section */}
        <section className="space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white">
            Web3 & On-Chain Hub
          </h1>
          <p className="text-sm font-mono text-zinc-400 max-w-xl">
            Decentralized identity, smart accounts and verified cryptographic endpoints for imlast999.
          </p>
        </section>

        {/* Primary Identity Vault Card */}
        <section className="relative rounded-2xl bg-gradient-to-br from-[#0c0c14]/98 via-[#090910]/95 to-[#06060a]/98 border border-zinc-700/80 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/5">
          {/* Top Beam */}
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-semibold">
                PRIMARY ETHEREUM ADDRESS
              </span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ERC-20 / EVM COMPATIBLE
              </span>
            </div>

            {/* Address Display & Copy Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 px-4 py-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs sm:text-sm text-zinc-200 break-all select-all flex items-center justify-between">
                <span>{ETH_ADDRESS}</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="px-6 py-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 hover:text-emerald-100 font-mono text-xs font-semibold transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.15)] flex items-center justify-center gap-2"
              >
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Address'}</span>
                <span>{copied ? '✓' : '⧉'}</span>
              </button>
            </div>

            {/* Network Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 block">STANDARD</span>
                <span className="text-xs font-mono text-zinc-300 font-medium">Ethereum / L2</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 block">KEY TYPE</span>
                <span className="text-xs font-mono text-zinc-300 font-medium">secp256k1</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 block">EXPLORER</span>
                <a
                  href={`https://etherscan.io/address/${ETH_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-emerald-400 hover:underline block truncate"
                >
                  Etherscan ↗
                </a>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 block">STATUS</span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Verified
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Ecosystem Portals Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-mono text-zinc-300 font-medium">Connected Protocols</h2>
            <span className="text-xs font-mono text-zinc-500">4 ecosystems linked</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ECOSYSTEM_PLATFORMS.map((platform) => (
              <a
                key={platform.id}
                href={platform.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  boxShadow: `0 10px 30px rgba(0,0,0,0.8), 0 0 20px ${platform.glow}`,
                }}
                className="group relative rounded-2xl p-6 bg-gradient-to-br from-[#0c0c14]/90 via-[#090910]/80 to-[#06060a]/90 border border-zinc-700/70 hover:border-zinc-500/90 transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer overflow-hidden"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                      style={{
                        color: platform.color,
                        borderColor: `${platform.color}40`,
                        backgroundColor: `${platform.color}10`,
                      }}
                    >
                      {platform.badge}
                    </span>
                    <span className="text-xs font-mono text-zinc-500 group-hover:text-zinc-200 transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transform">
                      ↗
                    </span>
                  </div>

                  <h3 className="text-lg font-medium text-white group-hover:text-emerald-300 transition-colors">
                    {platform.title}
                  </h3>
                  <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                    {platform.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>{platform.category}</span>
                  <span className="text-emerald-400/80 group-hover:text-emerald-300">open portal</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-zinc-900/90 text-center text-xs font-mono text-zinc-500 space-y-2">
          <p>Cryptographic identity for imlast999 · {new Date().getFullYear()}</p>
        </footer>
      </div>
    </main>
  )
}
