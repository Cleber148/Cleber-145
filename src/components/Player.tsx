import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, X, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Meditation } from '../types';

interface PlayerProps {
  meditation: Meditation | null;
  onClose: () => void;
}

export default function Player({ meditation, onClose }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (meditation) {
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
  }, [meditation]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  if (!meditation) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-8"
      >
        <div className="max-w-4xl mx-auto glass-panel p-6 flex flex-col md:flex-row items-center gap-6 shadow-2xl">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white"
          >
            <X size={20} />
          </button>

          <img 
            src={meditation.thumbnail} 
            alt={meditation.title}
            className="w-24 h-24 rounded-xl object-cover shadow-lg"
            referrerPolicy="no-referrer"
          />

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-medium mb-1">{meditation.title}</h2>
            <p className="text-sm text-white/60 mb-4">{meditation.description}</p>
            
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-orange-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-white/40 hover:text-white transition-colors">
              <SkipBack size={24} />
            </button>
            <button 
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>
            <button className="text-white/40 hover:text-white transition-colors">
              <SkipForward size={24} />
            </button>
          </div>

          <audio 
            ref={audioRef}
            src={meditation.audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
