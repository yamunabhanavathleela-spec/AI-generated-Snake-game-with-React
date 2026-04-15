import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Disc } from 'lucide-react';
import { TRACKS } from '../constants';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div id="music-player-container" className="hw-widget p-6 relative group">
      {/* Internal Glow - Recipe 7 */}
      <div 
        className="absolute inset-0 opacity-5 blur-[100px] transition-colors duration-1000 pointer-events-none"
        style={{ backgroundColor: currentTrack.color }}
      />

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Track Info Header */}
        <div className="flex items-center justify-between border-b border-hw-border pb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Disc className={`w-4 h-4 text-neon-cyan ${isPlaying ? 'animate-spin' : ''}`} />
              {isPlaying && <div className="absolute inset-0 bg-neon-cyan/20 blur-sm rounded-full animate-pulse" />}
            </div>
            <span className="hw-timecode">Audio.Stream.Active</span>
          </div>
          <span className="hw-timecode text-white/20">Track_{currentTrack.id.padStart(2, '0')}</span>
        </div>

        <div className="flex items-center gap-5">
          <motion.div 
            key={currentTrack.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-xl overflow-hidden shadow-2xl flex-shrink-0 border border-hw-border relative"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title}
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <motion.h3 
              key={currentTrack.title}
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-2xl font-bold truncate italic tracking-tighter"
            >
              {currentTrack.title}
            </motion.h3>
            <motion.p 
              key={currentTrack.artist}
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 0.5 }}
              className="hw-timecode text-neon-cyan mt-1"
            >
              {currentTrack.artist}
            </motion.p>
          </div>
        </div>

        {/* Progress Section - Recipe 3 */}
        <div className="space-y-3">
          <div className="relative h-1 w-full bg-hw-border rounded-full overflow-hidden">
            <motion.div 
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ backgroundColor: currentTrack.color }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
            />
            {/* Glow effect on progress bar */}
            <motion.div 
              className="absolute inset-y-0 left-0 blur-sm opacity-50"
              style={{ backgroundColor: currentTrack.color }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between">
            <span className="hw-timecode text-[8px]">{audioRef.current ? formatTime(audioRef.current.currentTime) : '00:00'}</span>
            <span className="hw-timecode text-[8px]">{audioRef.current ? formatTime(audioRef.current.duration) : '00:00'}</span>
          </div>
        </div>

        {/* Controls - Recipe 3 Hardware Style */}
        <div className="flex items-center justify-center gap-10 py-2">
          <button 
            id="btn-prev"
            onClick={handlePrev}
            className="p-3 text-hw-text-dim hover:text-white transition-all active:scale-90"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button 
            id="btn-play-pause"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-hw-border relative group/play"
          >
            <div className="absolute inset-0 rounded-full bg-white/5 group-hover/play:bg-white/10 transition-colors" />
            {isPlaying ? 
              <Pause className="w-6 h-6 text-white fill-white relative z-10" /> : 
              <Play className="w-6 h-6 text-white fill-white ml-1 relative z-10" />
            }
          </button>

          <button 
            id="btn-next"
            onClick={handleNext}
            className="p-3 text-hw-text-dim hover:text-white transition-all active:scale-90"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Volume Indicator */}
        <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-black/20 border border-hw-border/50">
          <Volume2 className="w-3 h-3 text-hw-text-dim" />
          <div className="flex-1 h-[2px] bg-hw-border rounded-full relative">
            <div className="absolute inset-y-0 left-0 w-2/3 bg-hw-text-dim/50 rounded-full" />
          </div>
          <span className="hw-timecode text-[8px]">Vol_65%</span>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  if (isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
