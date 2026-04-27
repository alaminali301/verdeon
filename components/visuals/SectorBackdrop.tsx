'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useEpaStore } from '@/lib/store/useEpaStore'
import { SECTOR_COLORS } from '@/lib/utils/colors'

type Scene = {
  title: string
  accent: string
  sky: string
  ground: string
  render: () => ReactNode
}

function SceneShell({ accent, sky, ground, children }: { accent: string; sky: string; ground: string; children: ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: `linear-gradient(180deg, ${sky} 0%, rgba(247,250,245,.95) 58%, rgba(236,245,238,.99) 100%)`,
        }}
      />
      <motion.div
        className="absolute inset-x-0 top-0 h-[34vh] transition-colors duration-500"
        style={{ backgroundColor: accent, opacity: 0.08 }}
        animate={{ opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[26vh]" style={{ background: `linear-gradient(180deg, rgba(255,255,255,0) 0%, ${ground} 100%)` }} />
      <div className="absolute inset-x-0 top-0 flex justify-center">
        <div className="relative h-[66vh] w-[min(96vw,1180px)]">{children}</div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,rgba(236,245,238,0)_0%,rgba(236,245,238,.98)_100%)]" />
    </div>
  )
}

function Sun({ accent, className = 'left-8 top-10 h-28 w-28' }: { accent: string; className?: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-sm ${className}`}
      style={{ background: `radial-gradient(circle, ${accent} 0%, rgba(255,255,255,0) 72%)` }}
      animate={{ scale: [1, 1.08, 1], opacity: [0.65, 0.95, 0.65] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function Cloud({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full bg-white/65 blur-2xl ${className}`}
      animate={{ x: [0, 18, 0], opacity: [0.45, 0.72, 0.45] }}
      transition={{ duration: 12 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

function PalmTree({ left, bottom, scale = 1, sway = 1 }: { left: string; bottom: string; scale?: number; sway?: number }) {
  return (
    <motion.div
      className="absolute origin-bottom"
      style={{ left, bottom, transform: `scale(${scale})` }}
      animate={{ rotate: [-0.8 * sway, 0.8 * sway, -0.8 * sway], y: [0, -2, 0] }}
      transition={{ duration: 4.8 + sway, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="relative h-40 w-20">
        <div className="absolute bottom-0 left-1/2 h-32 w-3 -translate-x-1/2 rounded-full bg-[#123b26]" />
        <div className="absolute bottom-[7.25rem] left-1/2 h-3 w-14 -translate-x-[86%] rotate-[-58deg] rounded-full bg-[#1a5c38]" />
        <div className="absolute bottom-[7.6rem] left-1/2 h-3 w-14 -translate-x-1/2 rotate-[0deg] rounded-full bg-[#1a5c38]" />
        <div className="absolute bottom-[7.25rem] left-1/2 h-3 w-14 -translate-x-[-22%] rotate-[58deg] rounded-full bg-[#1a5c38]" />
        <div className="absolute bottom-[6.6rem] left-1/2 h-3 w-12 -translate-x-[58%] rotate-[-28deg] rounded-full bg-[#1f6a41]" />
        <div className="absolute bottom-[6.6rem] left-1/2 h-3 w-12 -translate-x-[-42%] rotate-[28deg] rounded-full bg-[#1f6a41]" />
      </div>
    </motion.div>
  )
}

function HorizonWave({ className, accent }: { className: string; accent: string }) {
  return (
    <motion.div
      className={`absolute rounded-[999px] ${className}`}
      style={{ background: `linear-gradient(90deg, rgba(255,255,255,0), ${accent}, rgba(255,255,255,0))` }}
      animate={{ x: [0, 22, 0], opacity: [0.45, 0.75, 0.45] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function Ridge({
  className,
  color,
  clipPath,
}: {
  className: string
  color: string
  clipPath: string
}) {
  return <div className={`absolute ${className}`} style={{ backgroundColor: color, clipPath }} />
}

function SmokeStack({
  left,
  height,
  width,
  delay = 0,
}: {
  left: string
  height: string
  width: string
  delay?: number
}) {
  return (
    <div className="absolute bottom-0" style={{ left }}>
      <div className={`${width} ${height} rounded-t-[20px] bg-[#123b26] shadow-[0_20px_50px_rgba(0,0,0,.14)]`} />
      <motion.div
        className="absolute -top-16 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full bg-white/35 blur-2xl"
        animate={{ y: [0, -74], opacity: [0, 0.7, 0], x: [0, 10, 0] }}
        transition={{ duration: 4.4, repeat: Infinity, delay, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute -top-10 left-[55%] h-10 w-10 -translate-x-1/2 rounded-full bg-white/35 blur-xl"
        animate={{ y: [0, -58], opacity: [0, 0.55, 0], x: [0, -8, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, delay: delay + 0.4, ease: 'easeOut' }}
      />
    </div>
  )
}

function Flare({ className, accent }: { className: string; accent: string }) {
  return (
    <motion.div
      className={`absolute rounded-full ${className}`}
      style={{ background: `radial-gradient(circle, ${accent} 0%, rgba(255,255,255,0) 72%)` }}
      animate={{ scale: [1, 1.16, 1], opacity: [0.55, 1, 0.55] }}
      transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function Skyline() {
  return (
    <div className="absolute bottom-0 left-0 right-0">
      <div className="relative h-44">
        <div className="absolute bottom-0 left-10 h-24 w-8 rounded-t-[8px] bg-[#123b26]" />
        <div className="absolute bottom-0 left-20 h-32 w-10 rounded-t-[10px] bg-[#173d27]" />
        <div className="absolute bottom-0 left-[8.5rem] h-[4.5rem] w-6 rounded-t-[8px] bg-[#204f33]" />
        <div className="absolute bottom-0 left-[11.5rem] h-28 w-9 rounded-t-[10px] bg-[#123b26]" />
        <div className="absolute bottom-0 left-60 h-20 w-7 rounded-t-[8px] bg-[#173d27]" />
        <div className="absolute bottom-0 left-[19rem] h-36 w-12 rounded-t-[10px] bg-[#123b26]" />
        <div className="absolute bottom-0 right-16 h-24 w-8 rounded-t-[8px] bg-[#173d27]" />
        <div className="absolute bottom-0 right-28 h-[7.5rem] w-10 rounded-t-[10px] bg-[#123b26]" />
      </div>
    </div>
  )
}

function Pumpjack() {
  return (
    <motion.div
      className="absolute bottom-0 left-14"
      animate={{ rotate: [-2, 2, -2], y: [0, -2, 0] }}
      transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="relative h-44 w-32">
        <div className="absolute bottom-0 left-4 h-36 w-2 rounded-full bg-[#123b26]" />
        <div className="absolute bottom-10 left-0 h-2 w-32 rounded-full bg-[#123b26]" />
        <div className="absolute bottom-28 left-4 h-2 w-28 rotate-[-28deg] rounded-full bg-[#123b26]" />
        <div className="absolute bottom-24 left-6 h-2 w-20 rotate-[28deg] rounded-full bg-[#123b26]" />
      </div>
    </motion.div>
  )
}

function SceneGrid() {
  return (
    <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,.18)_100%)]" />
  )
}

function DefaultScene() {
  return (
    <SceneShell accent="#5ec48a" sky="rgba(248,252,249,.98)" ground="#dff3e5">
      <Sun accent="#5ec48a" className="left-10 top-8 h-28 w-28" />
      <Cloud className="left-1/3 top-12 h-14 w-36" delay={1} />
      <Cloud className="right-24 top-18 h-12 w-28" delay={3} />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-44 bg-[linear-gradient(180deg,rgba(94,196,138,.06)_0%,rgba(26,92,56,.42)_100%)]"
        animate={{ opacity: [0.78, 1, 0.78] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <Ridge
        className="bottom-10 left-12 h-24 w-[26rem] rounded-t-[120px]"
        color="#2d6b46"
        clipPath="polygon(0 100%, 8% 74%, 18% 82%, 29% 58%, 44% 72%, 58% 42%, 72% 60%, 86% 48%, 100% 100%)"
      />
      <Ridge
        className="bottom-8 right-6 h-20 w-[18rem] rounded-t-[100px]"
        color="#204f33"
        clipPath="polygon(0 100%, 20% 70%, 38% 78%, 52% 52%, 68% 62%, 82% 42%, 100% 100%)"
      />
      <SceneGrid />
    </SceneShell>
  )
}

function SectorPlantScene() {
  return (
    <SceneShell accent={SECTOR_COLORS['Power Plants']} sky="rgba(247,250,247,.98)" ground="#dff2e4">
      <Sun accent={SECTOR_COLORS['Power Plants']} className="left-8 top-8 h-[6.5rem] w-[6.5rem]" />
      <Cloud className="left-20 top-14 h-12 w-24" delay={1} />
      <Cloud className="right-24 top-20 h-10 w-20" delay={2.5} />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(16,71,42,.04)_0%,rgba(8,30,18,.74)_100%)]"
        animate={{ opacity: [0.82, 1, 0.82] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <SmokeStack left="5rem" height="h-44" width="w-14" delay={0} />
      <SmokeStack left="9rem" height="h-52" width="w-16" delay={0.45} />
      <SmokeStack left="13.5rem" height="h-40" width="w-12" delay={0.8} />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-56 bg-[linear-gradient(180deg,rgba(19,69,43,.18)_0%,rgba(8,30,18,.96)_100%)]"
        animate={{ opacity: [0.96, 1, 0.96] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <SceneGrid />
    </SceneShell>
  )
}

function ChemicalScene() {
  return (
    <SceneShell accent={SECTOR_COLORS.Chemicals} sky="rgba(247,251,248,.98)" ground="#e3f4e8">
      <Sun accent={SECTOR_COLORS.Chemicals} className="left-10 top-10 h-24 w-24" />
      <Cloud className="left-28 top-16 h-10 w-28" delay={1.2} />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-48 bg-[linear-gradient(180deg,rgba(16,71,42,.1)_0%,rgba(16,71,42,.72)_100%)]"
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div className="absolute bottom-10 left-16 h-36 w-24 rounded-[28px] bg-[linear-gradient(180deg,rgba(94,196,138,.96),rgba(16,71,42,.98))]" animate={{ y: [0, -6, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-14 left-44 h-24 w-24 rounded-full border border-white/25 bg-white/12 backdrop-blur-sm" animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-[5.5rem] left-48 h-10 w-10 rounded-full bg-white/45 blur-xl" animate={{ y: [0, -54], opacity: [0.15, 0.9, 0.15] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeOut' }} />
      <SceneGrid />
    </SceneShell>
  )
}

function GasScene() {
  return (
    <SceneShell accent={SECTOR_COLORS['Petroleum & Gas']} sky="rgba(248,251,247,.98)" ground="#e6f5ea">
      <Sun accent={SECTOR_COLORS['Petroleum & Gas']} className="left-10 top-8 h-24 w-24" />
      <Cloud className="left-1/4 top-14 h-10 w-28" delay={1} />
      <motion.div className="absolute bottom-0 left-0 right-0 h-48 bg-[linear-gradient(180deg,rgba(35,120,72,.08)_0%,rgba(35,120,72,.72)_100%)]" animate={{ opacity: [0.84, 1, 0.84] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
      <div className="absolute bottom-10 left-12 h-36 w-20 rounded-t-[22px] bg-[#123b26]" />
      <div className="absolute bottom-10 left-32 h-20 w-2 rounded-full bg-[#0f3824]" />
      <HorizonWave className="bottom-28 left-20 h-1.5 w-40" accent="rgba(255,186,89,.95)" />
      <Flare className="right-16 top-20 h-20 w-20" accent="rgba(255,186,89,.92)" />
      <SceneGrid />
    </SceneShell>
  )
}

function MineralScene() {
  return (
    <SceneShell accent={SECTOR_COLORS.Minerals} sky="rgba(247,250,247,.98)" ground="#deece0">
      <Sun accent={SECTOR_COLORS.Minerals} className="left-8 top-10 h-24 w-24" />
      <motion.div className="absolute bottom-0 left-0 right-0 h-52 bg-[linear-gradient(180deg,rgba(45,107,70,.08)_0%,rgba(45,107,70,.66)_100%)]" animate={{ opacity: [0.85, 1, 0.85] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
      <Ridge
        className="bottom-10 left-10 h-28 w-[20rem] rounded-t-[120px]"
        color="#2d6b46"
        clipPath="polygon(0 100%, 10% 72%, 24% 82%, 40% 52%, 56% 68%, 70% 40%, 86% 56%, 100% 100%)"
      />
      <Ridge
        className="bottom-12 right-10 h-24 w-[18rem] rounded-t-[120px]"
        color="#204f33"
        clipPath="polygon(0 100%, 16% 66%, 34% 78%, 50% 46%, 66% 60%, 82% 42%, 100% 100%)"
      />
      <motion.div className="absolute right-20 top-20 h-10 w-10 rounded-full bg-white/45 blur-xl" animate={{ y: [0, -40, 0], opacity: [0.15, 0.85, 0.15] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeOut' }} />
      <SceneGrid />
    </SceneShell>
  )
}

function WasteScene() {
  return (
    <SceneShell accent={SECTOR_COLORS.Waste} sky="rgba(247,251,247,.98)" ground="#e5f3e8">
      <Sun accent={SECTOR_COLORS.Waste} className="left-10 top-10 h-24 w-24" />
      <Cloud className="left-24 top-16 h-10 w-24" delay={1.6} />
      <motion.div className="absolute bottom-0 left-0 right-0 h-48 bg-[linear-gradient(180deg,rgba(143,217,168,.08)_0%,rgba(143,217,168,.72)_100%)]" animate={{ opacity: [0.85, 1, 0.85] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-12 left-14 h-28 w-48 rounded-[44px] bg-[linear-gradient(180deg,rgba(143,217,168,.8),rgba(16,71,42,.96))]" animate={{ y: [0, -4, 0] }} transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-26 left-40 h-10 w-10 rounded-full bg-white/40 blur-xl" animate={{ y: [0, -30, 0], opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeOut' }} />
      <SceneGrid />
    </SceneShell>
  )
}

function MetalsScene() {
  return (
    <SceneShell accent={SECTOR_COLORS.Metals} sky="rgba(247,250,247,.98)" ground="#ebf4ec">
      <Sun accent={SECTOR_COLORS.Metals} className="left-10 top-10 h-24 w-24" />
      <motion.div className="absolute bottom-0 left-0 right-0 h-52 bg-[linear-gradient(180deg,rgba(236,116,60,.1)_0%,rgba(236,116,60,.7)_100%)]" animate={{ opacity: [0.86, 1, 0.86] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-12 left-14 h-36 w-[16rem] rounded-[22px] bg-[linear-gradient(180deg,rgba(236,116,60,.82),rgba(16,71,42,.96))]" animate={{ y: [0, -6, 0] }} transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }} />
      <Flare className="right-20 top-18 h-20 w-20" accent="rgba(255,186,89,.92)" />
      <SceneGrid />
    </SceneShell>
  )
}

function RefineryScene() {
  return (
    <SceneShell accent={SECTOR_COLORS.Refineries} sky="rgba(247,250,247,.98)" ground="#e1efe5">
      <Sun accent={SECTOR_COLORS.Refineries} className="left-8 top-10 h-24 w-24" />
      <Cloud className="left-32 top-16 h-10 w-28" delay={1.2} />
      <motion.div className="absolute bottom-0 left-0 right-0 h-48 bg-[linear-gradient(180deg,rgba(26,92,56,.12)_0%,rgba(26,92,56,.68)_100%)]" animate={{ opacity: [0.86, 1, 0.86] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-12 left-12 h-40 w-14 rounded-t-[22px] bg-[#173d27]" animate={{ y: [0, -4, 0] }} transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-12 left-32 h-32 w-12 rounded-t-[20px] bg-[#123b26]" animate={{ y: [0, -6, 0] }} transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }} />
      <Flare className="right-16 top-16 h-20 w-20" accent="rgba(255,186,89,.9)" />
      <SceneGrid />
    </SceneShell>
  )
}

function StateLA() {
  return (
    <SceneShell accent="#f7c948" sky="rgba(254,247,222,.98)" ground="#dff3e5">
      <Sun accent="#f7c948" className="left-10 top-8 h-28 w-28" />
      <Cloud className="left-1/3 top-16 h-12 w-28" delay={1.2} />
      <motion.div className="absolute bottom-0 left-0 right-0 h-44 bg-[linear-gradient(180deg,rgba(74,160,108,.08)_0%,rgba(74,160,108,.72)_100%)]" animate={{ opacity: [0.86, 1, 0.86] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-6 left-0 right-0 h-20 bg-[linear-gradient(180deg,rgba(24,98,132,.12)_0%,rgba(24,98,132,.34)_100%)]" />
      <PalmTree left="4.5rem" bottom="2.5rem" scale={1.05} sway={0.9} />
      <PalmTree left="12rem" bottom="2rem" scale={0.9} sway={1.1} />
      <HorizonWave className="bottom-[4.5rem] left-10 h-1.5 w-56" accent="rgba(255,255,255,.9)" />
      <div className="absolute bottom-10 left-1/2 h-12 w-40 -translate-x-1/2 rounded-[100%] bg-white/22 blur-xl" />
      <SceneGrid />
    </SceneShell>
  )
}

function StateFL() {
  return (
    <SceneShell accent="#f7c948" sky="rgba(250,250,230,.98)" ground="#e7f6ec">
      <Sun accent="#f7c948" className="left-10 top-8 h-[6.5rem] w-[6.5rem]" />
      <motion.div className="absolute bottom-0 left-0 right-0 h-40 bg-[linear-gradient(180deg,rgba(94,196,138,.08)_0%,rgba(94,196,138,.65)_100%)]" animate={{ opacity: [0.86, 1, 0.86] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-6 left-0 right-0 h-14 bg-[linear-gradient(180deg,rgba(65,145,204,.18)_0%,rgba(65,145,204,.44)_100%)]" />
      <PalmTree left="3.5rem" bottom="2.2rem" scale={1.15} sway={0.8} />
      <PalmTree left="10.8rem" bottom="2rem" scale={0.95} sway={1} />
      <PalmTree left="17rem" bottom="2.4rem" scale={0.8} sway={1.2} />
      <HorizonWave className="bottom-16 left-12 h-1.5 w-60" accent="rgba(255,255,255,.88)" />
      <SceneGrid />
    </SceneShell>
  )
}

function StateCA() {
  return (
    <SceneShell accent="#f4b942" sky="rgba(255,244,214,.98)" ground="#e2f0e5">
      <Sun accent="#f4b942" className="left-8 top-8 h-28 w-28" />
      <motion.div className="absolute bottom-0 left-0 right-0 h-44 bg-[linear-gradient(180deg,rgba(45,107,70,.08)_0%,rgba(45,107,70,.72)_100%)]" animate={{ opacity: [0.86, 1, 0.86] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
      <Ridge
        className="bottom-14 left-10 h-28 w-[22rem] rounded-t-[120px]"
        color="#2d6b46"
        clipPath="polygon(0 100%, 9% 78%, 18% 84%, 30% 56%, 46% 72%, 58% 42%, 72% 62%, 86% 46%, 100% 100%)"
      />
      <Ridge
        className="bottom-16 left-44 h-24 w-[18rem] rounded-t-[120px]"
        color="#204f33"
        clipPath="polygon(0 100%, 16% 72%, 30% 82%, 46% 54%, 60% 68%, 76% 50%, 100% 100%)"
      />
      <PalmTree left="20rem" bottom="2rem" scale={0.78} sway={1} />
      <HorizonWave className="bottom-16 right-12 h-1.5 w-56" accent="rgba(255,255,255,.85)" />
      <SceneGrid />
    </SceneShell>
  )
}

function StateTX() {
  return (
    <SceneShell accent="#ff9f43" sky="rgba(255,243,223,.98)" ground="#e8f0e8">
      <Sun accent="#ff9f43" className="left-8 top-8 h-28 w-28" />
      <motion.div className="absolute bottom-0 left-0 right-0 h-48 bg-[linear-gradient(180deg,rgba(35,120,72,.08)_0%,rgba(35,120,72,.72)_100%)]" animate={{ opacity: [0.86, 1, 0.86] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} />
      <Pumpjack />
      <motion.div className="absolute bottom-10 left-40 h-28 w-24 rounded-[18px] bg-[#123b26]" animate={{ y: [0, -4, 0] }} transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-16 left-56 h-[4.5rem] w-2 rounded-full bg-[#0f3824]" animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
      <Flare className="right-20 top-18 h-24 w-24" accent="rgba(255,159,67,.92)" />
      <SceneGrid />
    </SceneShell>
  )
}

function StateNY() {
  return (
    <SceneShell accent="#7eb6ff" sky="rgba(245,249,255,.98)" ground="#dfeaf7">
      <Sun accent="#7eb6ff" className="left-10 top-8 h-24 w-24" />
      <motion.div className="absolute bottom-0 left-0 right-0 h-44 bg-[linear-gradient(180deg,rgba(26,92,56,.08)_0%,rgba(26,92,56,.66)_100%)]" animate={{ opacity: [0.84, 1, 0.84] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
      <Skyline />
      <motion.div className="absolute bottom-[4.5rem] left-36 h-1.5 w-40 rounded-full bg-white/55" animate={{ x: [0, 22, 0], opacity: [0.45, 0.85, 0.45] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
      <SceneGrid />
    </SceneShell>
  )
}

function StateOH() {
  return (
    <SceneShell accent="#a5b4fc" sky="rgba(247,248,255,.98)" ground="#e3ebef">
      <Sun accent="#a5b4fc" className="left-10 top-10 h-24 w-24" />
      <motion.div className="absolute bottom-0 left-0 right-0 h-44 bg-[linear-gradient(180deg,rgba(12,51,32,.08)_0%,rgba(12,51,32,.68)_100%)]" animate={{ opacity: [0.84, 1, 0.84] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-12 left-12 h-[8.5rem] w-12 rounded-t-[16px] bg-[#123b26]" animate={{ y: [0, -4, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-12 left-[8.5rem] h-[6.5rem] w-10 rounded-t-[16px] bg-[#173d27]" animate={{ y: [0, -6, 0] }} transition={{ duration: 4.7, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-[4.5rem] left-44 h-1.5 w-40 rounded-full bg-white/45" animate={{ x: [0, 18, 0], opacity: [0.35, 0.8, 0.35] }} transition={{ duration: 8.6, repeat: Infinity, ease: 'easeInOut' }} />
      <SceneGrid />
    </SceneShell>
  )
}

const SECTOR_SCENES: Record<string, Scene> = {
  default: {
    title: 'Public data',
    accent: '#5ec48a',
    sky: 'rgba(248,252,249,.98)',
    ground: '#dff3e5',
    render: () => <DefaultScene />,
  },
  'Power Plants': {
    title: 'Power plants',
    accent: SECTOR_COLORS['Power Plants'],
    sky: 'rgba(247,250,247,.98)',
    ground: '#dff2e4',
    render: () => <SectorPlantScene />,
  },
  Chemicals: {
    title: 'Chemicals',
    accent: SECTOR_COLORS.Chemicals,
    sky: 'rgba(247,251,248,.98)',
    ground: '#e3f4e8',
    render: () => <ChemicalScene />,
  },
  'Petroleum & Gas': {
    title: 'Petroleum & gas',
    accent: SECTOR_COLORS['Petroleum & Gas'],
    sky: 'rgba(248,251,247,.98)',
    ground: '#e6f5ea',
    render: () => <GasScene />,
  },
  Minerals: {
    title: 'Minerals',
    accent: SECTOR_COLORS.Minerals,
    sky: 'rgba(247,250,247,.98)',
    ground: '#deece0',
    render: () => <MineralScene />,
  },
  Waste: {
    title: 'Waste',
    accent: SECTOR_COLORS.Waste,
    sky: 'rgba(247,251,247,.98)',
    ground: '#e5f3e8',
    render: () => <WasteScene />,
  },
  Metals: {
    title: 'Metals',
    accent: SECTOR_COLORS.Metals,
    sky: 'rgba(247,250,247,.98)',
    ground: '#ebf4ec',
    render: () => <MetalsScene />,
  },
  Refineries: {
    title: 'Refineries',
    accent: SECTOR_COLORS.Refineries,
    sky: 'rgba(247,250,247,.98)',
    ground: '#e1efe5',
    render: () => <RefineryScene />,
  },
  Other: {
    title: 'Other',
    accent: SECTOR_COLORS.Other,
    sky: 'rgba(247,250,247,.98)',
    ground: '#dff2e4',
    render: () => <DefaultScene />,
  },
}

const STATE_SCENES: Record<string, Scene> = {
  LA: {
    title: 'Louisiana',
    accent: '#f7c948',
    sky: 'rgba(254,247,222,.98)',
    ground: '#dff3e5',
    render: () => <StateLA />,
  },
  FL: {
    title: 'Florida',
    accent: '#f7c948',
    sky: 'rgba(250,250,230,.98)',
    ground: '#e7f6ec',
    render: () => <StateFL />,
  },
  CA: {
    title: 'California',
    accent: '#f4b942',
    sky: 'rgba(255,244,214,.98)',
    ground: '#e2f0e5',
    render: () => <StateCA />,
  },
  TX: {
    title: 'Texas',
    accent: '#ff9f43',
    sky: 'rgba(255,243,223,.98)',
    ground: '#e8f0e8',
    render: () => <StateTX />,
  },
  NY: {
    title: 'New York',
    accent: '#7eb6ff',
    sky: 'rgba(245,249,255,.98)',
    ground: '#dfeaf7',
    render: () => <StateNY />,
  },
  OH: {
    title: 'Ohio',
    accent: '#a5b4fc',
    sky: 'rgba(247,248,255,.98)',
    ground: '#e3ebef',
    render: () => <StateOH />,
  },
}

function resolveScene(activeState: string | null, activeSector: string | null) {
  if (activeState && STATE_SCENES[activeState]) return STATE_SCENES[activeState]
  if (activeSector && SECTOR_SCENES[activeSector]) return SECTOR_SCENES[activeSector]
  return SECTOR_SCENES.default
}

export function SectorBackdrop() {
  const activeSector = useEpaStore((state) => state.activeSector)
  const activeState = useEpaStore((state) => state.activeState)
  const scene = resolveScene(activeState, activeSector)

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: `radial-gradient(circle at 14% 14%, rgba(94,196,138,.16), transparent 22%),
            radial-gradient(circle at 86% 18%, rgba(255,186,89,.12), transparent 20%),
            linear-gradient(180deg, rgba(247,251,247,.98) 0%, rgba(238,247,240,.96) 55%, rgba(232,243,234,.99) 100%)`,
        }}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeState ?? 'none'}-${activeSector ?? 'none'}-${scene.title}`}
          className="absolute inset-x-0 top-0 h-[68vh]"
          initial={{ opacity: 0.2, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {scene.render()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
