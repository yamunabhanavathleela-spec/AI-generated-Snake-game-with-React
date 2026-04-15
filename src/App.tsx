import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div id="app-root" className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Atmospheric Background - Recipe 7 */}
      <div id="background-atmosphere" className="atmosphere" />
      
      {/* Scanline Overlay */}
      <div id="scanline-overlay" className="scanlines" />

      <div id="main-container" className="relative z-10 w-full max-w-6xl flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-8 items-center lg:items-start">
        {/* Header Section - Editorial Style - Recipe 2 */}
        <header id="app-header" className="lg:col-span-2 w-full flex flex-col items-center lg:items-start gap-2 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-baseline gap-4"
          >
            <span className="hw-timecode text-neon-cyan">System.v1.0.4</span>
            <div className="h-[1px] w-12 bg-hw-border" />
          </motion.div>
          
          <motion.h1 
            id="main-title"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter uppercase italic font-sans leading-[0.85]"
          >
            <span className="text-white">Neon</span>
            <br />
            <span className="text-neon-cyan neon-text-cyan">Rhythm</span>
          </motion.h1>
          
          <motion.p 
            id="main-subtitle"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 0.4 }}
            className="text-xs font-serif italic tracking-widest text-white/60 mt-2"
          >
            A Specialist Tool for Retro-Arcade Simulation & Cybernetic Beats
          </motion.p>
        </header>

        {/* Game Section */}
        <main id="game-viewport" className="w-full flex justify-center">
          <SnakeGame />
        </main>

        {/* Sidebar / Player Section */}
        <aside id="sidebar-controls" className="w-full flex flex-col gap-6">
          <MusicPlayer />
          
          {/* Instructions Widget - Hardware Style - Recipe 3 */}
          <div id="instructions-widget" className="hw-widget p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-hw-border pb-3">
              <h4 className="hw-timecode">Operational.Manual</h4>
              <div className="w-2 h-2 rounded-full bg-neon-lime shadow-[0_0_8px_rgba(57,255,20,0.5)]" />
            </div>
            
            <ul className="space-y-4 text-[13px] text-hw-text-dim font-sans leading-relaxed">
              <li className="flex items-start gap-4">
                <span className="hw-timecode text-neon-cyan mt-1">01</span>
                <p>Ingest <span className="text-neon-magenta font-bold">Magenta Orbs</span> to expand neural length and increment score.</p>
              </li>
              <li className="flex items-start gap-4">
                <span className="hw-timecode text-neon-cyan mt-1">02</span>
                <p>Avoid structural collision with perimeter boundaries or self-segments.</p>
              </li>
              <li className="flex items-start gap-4">
                <span className="hw-timecode text-neon-cyan mt-1">03</span>
                <p>Audio stream remains persistent across session states. Maintain flow.</p>
              </li>
            </ul>
          </div>

          <div id="system-footer" className="flex justify-between items-end px-2">
            <div className="flex flex-col gap-1">
              <span className="hw-timecode text-[8px]">Core.Status</span>
              <span className="text-[10px] font-mono text-neon-lime uppercase tracking-tighter">Synchronized // Active</span>
            </div>
            <div className="text-[9px] font-mono text-white/10 uppercase text-right leading-tight">
              Terminal_ID: 0x7F2A<br />
              Location: Sector_7
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
