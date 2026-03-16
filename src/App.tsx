import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Wind, Moon, Sun, Coffee, Brain, Heart, Search } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { meditations } from './data/meditations';
import { Meditation } from './types';
import Player from './components/Player';
import BreathingTool from './components/BreathingTool';

const CATEGORIES = [
  { name: 'Sono', icon: Moon, color: 'text-indigo-400' },
  { name: 'Foco', icon: Brain, color: 'text-emerald-400' },
  { name: 'Estresse', icon: Wind, color: 'text-blue-400' },
  { name: 'Manhã', icon: Sun, color: 'text-orange-400' },
  { name: 'Ansiedade', icon: Heart, color: 'text-rose-400' },
];

export default function App() {
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null);
  const [aiQuote, setAiQuote] = useState<string>('Inspire paz, expire tensão.');
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Tudo');

  useEffect(() => {
    fetchAiQuote();
  }, []);

  const fetchAiQuote = async () => {
    setIsLoadingQuote(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Dê-me uma frase curta, poderosa e poética de mindfulness para um aplicativo de meditação. Em Português do Brasil. Máximo 15 palavras.",
      });
      if (response.text) {
        setAiQuote(response.text.replace(/"/g, ''));
      }
    } catch (error) {
      console.error('Error fetching AI quote:', error);
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const [isRecommending, setIsRecommending] = useState(false);

  const handleMoodRecommendation = async (mood: string) => {
    setIsRecommending(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const prompt = `O usuário está se sentindo ${mood}. Com base nestes títulos de meditação: ${meditations.map(m => m.title).join(', ')}, qual deles ele deve ouvir? Retorne APENAS o título exato da meditação.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      
      const recommendedTitle = response.text?.trim();
      const recommendation = meditations.find(m => m.title.toLowerCase().includes(recommendedTitle?.toLowerCase() || ''));
      
      if (recommendation) {
        setSelectedMeditation(recommendation);
      }
    } catch (error) {
      console.error('Error getting recommendation:', error);
    } finally {
      setIsRecommending(false);
    }
  };

  const filteredMeditations = activeCategory === 'Tudo' 
    ? meditations 
    : meditations.filter(m => m.category === activeCategory);

  return (
    <div className="min-h-screen relative pb-32">
      <div className="atmosphere" />
      
      {/* Header */}
      <header className="p-6 md:p-12 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Sparkles className="text-white" size={20} />
          </div>
          <h1 className="text-2xl font-light tracking-tighter">Relaxe e se Inspire-se</h1>
        </motion.div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <Search size={20} className="text-white/60" />
          </button>
          <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden">
            <img src="https://picsum.photos/seed/user/100/100" alt="Profile" referrerPolicy="no-referrer" />
          </div>
        </div>
      </header>

      <main className="px-6 md:px-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="py-12 md:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4 block">Intenção Diária</span>
            <h2 className="text-4xl md:text-6xl serif-text italic font-light leading-tight max-w-3xl mx-auto">
              {isLoadingQuote ? '...' : aiQuote}
            </h2>
          </motion.div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Categories */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm uppercase tracking-widest text-white/60">Explorar</h3>
                <button 
                  onClick={() => setActiveCategory('Tudo')}
                  className="text-xs text-orange-400 hover:underline"
                >
                  Ver Tudo
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex-shrink-0 flex items-center gap-3 px-6 py-4 rounded-2xl glass-panel transition-all hover:scale-105 ${activeCategory === cat.name ? 'border-orange-500/50 bg-orange-500/5' : ''}`}
                  >
                    <cat.icon size={20} className={cat.color} />
                    <span className="text-sm font-medium">{cat.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Meditations Grid */}
            <section>
              <h3 className="text-sm uppercase tracking-widest text-white/60 mb-6">Recomendado para você</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMeditations.map((meditation, idx) => (
                  <motion.div
                    key={meditation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setSelectedMeditation(meditation)}
                    className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer"
                  >
                    <img 
                      src={meditation.thumbnail} 
                      alt={meditation.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-white/10 backdrop-blur-md">
                          {meditation.duration}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-orange-500/20 text-orange-300 backdrop-blur-md">
                          {meditation.category}
                        </span>
                      </div>
                      <h4 className="text-xl font-medium">{meditation.title}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="glass-panel p-8">
              <h3 className="text-sm uppercase tracking-widest text-white/60 mb-6">Orientação Personalizada</h3>
              <p className="text-xs text-white/40 mb-4">Como você está se sentindo agora?</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Ansioso', 'Cansado', 'Agitado', 'Focado', 'Triste'].map(mood => (
                  <button 
                    key={mood}
                    onClick={() => handleMoodRecommendation(mood)}
                    className="px-3 py-1 rounded-full border border-white/10 text-[10px] uppercase tracking-wider hover:bg-white/10 transition-colors"
                  >
                    {mood}
                  </button>
                ))}
              </div>
              {isRecommending && <p className="text-xs italic text-orange-400 animate-pulse">Relaxe e se Inspire-se está pensando...</p>}
            </div>

            <BreathingTool />
            
            <div className="glass-panel p-8">
              <h3 className="text-sm uppercase tracking-widest text-white/60 mb-6">Seu Progresso</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-3xl font-light">12</p>
                    <p className="text-[10px] uppercase tracking-widest text-white/40">Dias de Sequência</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-light">4.5h</p>
                    <p className="text-[10px] uppercase tracking-widest text-white/40">Tempo Total</p>
                  </div>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-orange-500/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Player 
        meditation={selectedMeditation} 
        onClose={() => setSelectedMeditation(null)} 
      />
    </div>
  );
}
