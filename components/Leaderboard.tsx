import React from 'react';
import { PlayerScore } from '../types';
import { Trophy, Medal, Crown } from 'lucide-react';

interface LeaderboardProps {
  scores: PlayerScore[];
  title?: string;
  type?: 'round' | 'global';
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ scores, title, type = 'global' }) => {
  // Global shows top 50, Round shows all active players (or top 50 to be safe)
  const sortedScores = [...scores]
    .sort((a, b) => b.score - a.score || a.lastMatchTime - b.lastMatchTime)
    .slice(0, 50);

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 w-full h-full overflow-hidden flex flex-col">
      {/* Dynamic Header */}
      {title && (
        <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
          {type === 'global' ? <Crown className="text-yellow-400" size={20} /> : <Medal className="text-tiktok-cyan" size={20} />}
          <h2 className="font-bold text-lg text-white">{title}</h2>
        </div>
      )}
      
      {sortedScores.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 space-y-2 opacity-50">
          <Trophy size={40} strokeWidth={1} />
          <span className="text-sm italic">Belum ada data...</span>
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto pr-1 no-scrollbar flex-1">
          {sortedScores.map((player, index) => (
            <div 
              key={player.uniqueId} 
              className={`flex items-center justify-between p-2 rounded-lg animate-fade-in border ${
                index === 0 ? 'bg-yellow-900/10 border-yellow-600/30' : 
                index === 1 ? 'bg-gray-800/60 border-gray-600/30' : 
                index === 2 ? 'bg-orange-900/10 border-orange-700/30' : 
                'bg-gray-800/30 border-gray-800 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="relative shrink-0">
                  <img 
                    src={player.profilePictureUrl} 
                    alt={player.nickname || player.uniqueId} 
                    className={`w-10 h-10 rounded-full object-cover border-2 ${
                      index === 0 ? 'border-yellow-400' :
                      index === 1 ? 'border-gray-300' :
                      index === 2 ? 'border-orange-500' :
                      'border-gray-700'
                    }`}
                  />
                  <div className={`absolute -top-1 -right-1 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-500' :
                      index === 2 ? 'bg-orange-600' :
                      'bg-gray-700'
                  }`}>
                    {index + 1}
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className={`font-bold text-sm truncate ${
                      index === 0 ? 'text-yellow-400' :
                      index === 1 ? 'text-gray-200' :
                      index === 2 ? 'text-orange-300' :
                      'text-gray-300'
                  }`}>
                    {player.nickname || player.uniqueId}
                  </span>
                  {type === 'global' && (
                     <span className="text-[10px] text-gray-500">Total Score</span>
                  )}
                </div>
              </div>
              <div className={`font-bold text-lg ${
                 index === 0 ? 'text-yellow-400' : 'text-white'
              }`}>
                {player.score}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};