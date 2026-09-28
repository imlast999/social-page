'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const ETH_ADDRESS = '0x2232047f31888e6EAdC21d920E8FC4BD3ccDE13f'
const ABSTRACT_PROFILE = 'https://portal.abs.xyz/profile/0x73c83FD4803095f2da1D2b4C74D6332abbd100AD'
const AXIOM_PROFILE = 'https://axiom.trade/@imlast999'
const SHARKS_URL = 'https://millionairesharks.com'
const FOMO_URL = 'https://fomo.family/r/imlast999'

const PROTOCOLS = [
  {
    id: 'axiom',
    title: 'Axiom',
    handle: '@imlast999',
    description: 'On-chain derivatives & quantitative trading analytics profile.',
    url: AXIOM_PROFILE,
    category: 'Decentralized Trading',
    status: 'ACTIVE',
  },
  {
    id: 'abstract',
    title: 'Abstract',
    handle: '0x73c8...100AD',
    description: 'Consumer crypto on-chain identity and EVM Layer 2 accounts.',
    url: ABSTRACT_PROFILE,
    category: 'EVM L2 Network',
    status: 'CONNECTED',
  },
  {
    id: 'sharks',
    title: 'Millionaire Sharks',
    handle: 'millionairesharks.com',
    description: 'Web3 digital collective portal and community architecture.',
    url: SHARKS_URL,
    category: 'Ecosystem Project',
    status: 'PRODUCTION',
  },
  {
    id: 'fomo',
    title: 'FOMO',
    handle: 'imlast999',
    description: 'Decentralized social connectivity and on-chain invitation network.',
    url: FOMO_URL,
    category: 'Crypto Social',
    status: 'VERIFIED',
  },
]

export default function Web3Page() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(ETH_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen w-full bg-[#050508] text-zinc-100 select-none relative overflow-x-hidden font-mono antialiased">
      {/* Background Subtle Cyber Grid */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-cyber-grid opacity-25" />
      
      {/* Ambient Lighting */}
      <div className="pointer-events-none fixed -top-40 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px]" />
      <div className="pointer-events-none fixed bottom-10 left-10 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[140px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-12">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between border-b border-zinc-850 pb-5">
          <Link
            href="/"
            className="group flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>return to orbit</span>
          </Link>

          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>MAINNET VERIFIED</span>
          </div>
        </header>

        {/* Identity & Visual Monolith Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-400">
              <span>ROOT IDENTITY</span>
              <span>·</span>
              <span className="text-emerald-400">imlast999.is-a.dev</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-white uppercase">
              Web3 Vault
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans max-w-lg">
              Cryptographic address registry, smart accounts, and verified protocol endpoints.
            </p>
          </div>

          {/* Generated Obsidian Sigil Artwork */}
          <div className="md:col-span-5 relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950/80 shadow-[0_0_40px_rgba(0,0,0,0.8)] aspect-[4/3] group">
            <Image
              src="/images/web3_sigil.jpg"
              alt="Cryptographic Obsidian Monolith"
              fill
              className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              sizes="(max-width: 768px) 100vw, 380px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] text-zinc-400">
              <span>SEC_SPEC: secp256k1</span>
              <span>STATE: ON-CHAIN</span>
            </div>
          </div>
        </section>

        {/* Primary Address Registry Card */}
        <section className="rounded-xl bg-[#09090e] border border-zinc-800 p-6 sm:p-7 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs tracking-wider uppercase text-zinc-300 font-semibold">
                Ethereum Mainnet & Layer 2 Address
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              EVM STANDARD
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 px-4 py-3 rounded-lg bg-black/90 border border-zinc-850 text-xs sm:text-sm text-zinc-200 break-all select-all flex items-center justify-between">
              <span>{ETH_ADDRESS}</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="px-5 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 hover:border-zinc-500 text-zinc-200 hover:text-white text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{copied ? 'Copied' : 'Copy Address'}</span>
              <span className="text-emerald-400">{copied ? '✓' : '⧉'}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-zinc-850 flex items-center justify-between flex-wrap gap-3 text-xs text-zinc-400">
            <span>Explorer verification:</span>
            <a
              href={`https://etherscan.io/address/${ETH_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>etherscan.io</span>
              <span>↗</span>
            </a>
          </div>
        </section>

        {/* Connected Protocols Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm uppercase tracking-wider text-zinc-400">
              Protocol Directory
            </h2>
            <span className="text-xs text-zinc-600">4 verified</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROTOCOLS.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="group p-5 rounded-xl bg-[#09090e] border border-zinc-850 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-850 flex items-center justify-between text-xs text-zinc-400">
                  <span>{item.category}</span>
                  <span className="text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1">
                    <span>{item.handle}</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">↗</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-zinc-850 text-center text-xs text-zinc-600">
          <p>imlast999 · on-chain public key registry · {new Date().getFullYear()}</p>
        </footer>
      </div>
    </main>
  )
}
