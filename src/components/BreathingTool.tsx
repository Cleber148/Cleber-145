import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function BreathingTool() {
  const [phase, setPhase] = useState<'Inspire' | 'Segure' | 'Expire'>('Inspire');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    let timer: NodeJS.Timeout;
    if (phase === 'Inspire') {
      timer = setTimeout(() => setPhase('Segure'), 4000);
    } else if (phase === 'Segure') {
      timer = setTimeout(() => setPhase('Expire'), 4000);
    } else {
      timer = setTimeout(() => setPhase('Inspire'), 4000);
    }

    return () => clearTimeout(timer);
  }, [phase, isActive]);

  return (
    <div className="flex flex-col items-center justify-center p-8 glass-panel">
      <h3 className="text-sm uppercase tracking-widest text-white/60 mb-8">Guia de Respiração</h3>
      
      <div className="relative w-48 h-48 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute text-xl font-light tracking-widest uppercase"
          >
            {isActive ? phase : 'Pronto?'}
          </motion.div>
        </AnimatePresence>

        <motion.div
          animate={isActive ? {
            scale: phase === 'Inspire' ? 1.5 : phase === 'Segure' ? 1.5 : 1,
            opacity: phase === 'Inspire' ? 0.4 : phase === 'Segure' ? 0.6 : 0.2,
          } : { scale: 1, opacity: 0.2 }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="w-32 h-32 rounded-full bg-orange-500 blur-xl"
        />
        
        <div className="absolute w-40 h-40 border border-white/10 rounded-full" />
      </div>

      <button
        onClick={() => setIsActive(!isActive)}
        className="mt-12 px-8 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm uppercase tracking-widest"
      >
        {isActive ? 'Pausar' : 'Iniciar Sessão'}
      </button>
    </div>
  );
}
