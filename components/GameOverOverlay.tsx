import React from 'react';
import { PlayerScore } from '../types';
import { Trophy, RefreshCw, Crown, Medal } from 'lucide-react';

interface GameOverOverlayProps {
  scores: PlayerScore[];
  onRestart: () => void;
}

export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ scores, onRestart }) => {
  // Sort and take top 3
  const topPlayers = [...scores]
    .sort((a, b) => b.score - a.score || a.lastMatchTime - b.lastMatchTime)
    .slice(0, 3);

  const winner = topPlayers[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-gray-900 border border-gray-700 rounded-3xl p-6 shadow-[0_0_50px_rgba(37,244,238,0.15)] overflow-hidden">
        
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-tiktok-cyan/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          
          {/* Header */}
          <div className="mb-6 text-center">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-2 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-bounce-short" />
            <h2 className="text-3xl font-bold text-white tracking-tight">GAME OVER</h2>
            <p className="text-tiktok-cyan font-medium text-sm">All pairs found!</p>
          </div>

          {/* Winner Showcase */}
          {winner ? (
            <div className="w-full mb-6">
              <div className="flex flex-col items-center p-4 bg-gradient-to-b from-gray-800 to-gray-800/50 rounded-2xl border border-yellow-500/30 shadow-lg relative">
                <div className="absolute -top-4">
                  <Crown className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                </div>
                <img 
                  src={winner.profilePictureUrl} 
                  alt={winner.uniqueId} 
                  className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-xl mb-3 object-cover"
                />
                <span className="text-xl font-bold text-white truncate max-w-full text-center">{winner.uniqueId}</span>
                <span className="text-yellow-400 font-bold text-sm bg-yellow-400/10 px-3 py-1 rounded-full mt-1">
                  {winner.score} Points
                </span>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 mb-6 italic">No winners this round.</div>
          )}

          {/* Runners Up */}
          <div className="w-full space-y-3 mb-8">
            {topPlayers.slice(1).map((player, index) => (
              <div key={player.uniqueId} className="flex items-center justify-between bg-gray-800/50 p-3 rounded-xl border border-gray-700">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="relative shrink-0">
                    <img src={player.profilePictureUrl} className="w-10 h-10 rounded-full object-cover" alt="" />
                    <div className="absolute -bottom-1 -right-1 bg-gray-700 rounded-full p-0.5">
                      <Medal size={12} className={index === 0 ? "text-gray-300" : "text-orange-400"} />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-white truncate">{player.uniqueId}</span>
                </div>
                <span className="font-bold text-gray-300 text-sm">{player.score} pts</span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button 
            onClick={onRestart}
            className="w-full bg-tiktok-cyan hover:bg-cyan-400 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_0_20px_rgba(37,244,238,0.3)]"
          >
            <RefreshCw size={20} />
            <span>Play Again</span>
          </button>

        </div>
      </div>
    </div>
  );
};