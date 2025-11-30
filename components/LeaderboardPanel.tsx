import React, { useState } from 'react';
import { PlayerScore } from '../types';
import { Leaderboard } from './Leaderboard';
import { Timer, Globe } from 'lucide-react';

interface LeaderboardPanelProps {
  sessionScores: PlayerScore[];
  globalScores: PlayerScore[];
}

export const LeaderboardPanel: React.FC<LeaderboardPanelProps> = ({ sessionScores, globalScores }) => {
  const [viewMode, setViewMode] = useState<'round' | 'global'>('global');

  return (
    <div className="h-full p-4 animate-fade-in pb-20 flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-white">Rankings</h2>
      
      {/* Toggle Switcher */}
      <div className="flex bg-gray-800/50 p-1 rounded-xl mb-4 border border-gray-700">
        <button 
          onClick={() => setViewMode('round')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
            viewMode === 'round' 
              ? 'bg-tiktok-cyan text-black shadow-lg' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Timer size={14} />
          Round Ini
        </button>
        <button 
          onClick={() => setViewMode('global')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
            viewMode === 'global' 
              ? 'bg-tiktok-cyan text-black shadow-lg' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Globe size={14} />
          Global (All-Time)
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
         {viewMode === 'round' ? (
           <Leaderboard 
              scores={sessionScores} 
              title="Skor Ronde Ini" 
              type="round" 
           />
         ) : (
           <Leaderboard 
              scores={globalScores} 
              title="Top Global Leaderboard" 
              type="global" 
           />
         )}
      </div>
    </div>
  );
};