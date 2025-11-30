import React, { useState, useEffect } from 'react';
import { PlayerScore } from '../types';
import { Trophy, RefreshCw, Crown, Timer, Globe, Medal } from 'lucide-react';

interface GameOverOverlayProps {
  scores: PlayerScore[];       // Current Round Scores
  globalScores: PlayerScore[]; // All-time Scores
  onRestart: () => void;
}

export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ scores, globalScores, onRestart }) => {
  const [timeLeft, setTimeLeft] = useState(20);

  // Auto-restart timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      onRestart();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onRestart]);

  // Logic to determine which view to show
  // > 10s : Show Round Results
  // <= 10s : Show Global Results
  const showRoundResults = timeLeft > 10;
  
  // Select data source
  const currentData = showRoundResults ? scores : globalScores;
  
  // Sort and take top 10
  const topPlayers = [...currentData]
    .sort((a, b) => b.score - a.score || a.lastMatchTime - b.lastMatchTime)
    .slice(0, 10);

  const winner = topPlayers[0];
  const runnersUp = topPlayers.slice(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-gray-900 border border-gray-700 rounded-3xl p-5 shadow-[0_0_50px_rgba(37,244,238,0.15)] flex flex-col max-h-[85vh] transition-all duration-500">
        
        {/* Background decorative elements */}
        <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-b ${showRoundResults ? 'from-tiktok-cyan/10' : 'from-purple-500/10'} to-transparent pointer-events-none rounded-t-3xl transition-colors duration-500`} />
        
        {/* Header (Dynamic) */}
        <div className="relative z-10 text-center mb-4 shrink-0 animate-fade-in" key={showRoundResults ? 'round' : 'global'}>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
            {showRoundResults ? (
               <Medal className="w-6 h-6 text-tiktok-cyan animate-bounce-short" />
            ) : (
               <Globe className="w-6 h-6 text-purple-400 animate-bounce-short" />
            )}
            {showRoundResults ? "ROUND WINNERS" : "TOP GLOBAL"}
          </h2>
          <p className={`${showRoundResults ? 'text-tiktok-cyan' : 'text-purple-400'} text-xs font-medium uppercase tracking-widest`}>
            {showRoundResults ? "Hasil Permainan Ini" : "Pemain Terbaik Sepanjang Masa"}
          </p>
        </div>

        {/* Winner Showcase (Fixed at top) */}
        <div className="relative z-10 w-full mb-4 shrink-0 animate-fade-in" key={winner ? winner.uniqueId : 'none'}>
          {winner ? (
            <div className={`flex items-center gap-4 p-3 bg-gradient-to-r ${showRoundResults ? 'from-gray-800 to-gray-800/50 border-yellow-500/30' : 'from-purple-900/20 to-gray-800/50 border-purple-500/30'} rounded-2xl border shadow-lg relative overflow-hidden transition-all duration-300`}>
              <div className={`absolute -right-4 -top-4 ${showRoundResults ? 'text-yellow-500/10' : 'text-purple-500/10'}`}>
                <Crown size={80} />
              </div>
              
              <div className="relative">
                 <div className="absolute -top-2.5 -left-1.5 transform -rotate-12">
                  <Crown className={`w-5 h-5 ${showRoundResults ? 'text-yellow-400 fill-yellow-400' : 'text-purple-400 fill-purple-400'}`} />
                </div>
                <img 
                  src={winner.profilePictureUrl} 
                  alt={winner.nickname} 
                  className={`w-14 h-14 rounded-full border-2 ${showRoundResults ? 'border-yellow-400' : 'border-purple-400'} shadow-md object-cover`}
                />
              </div>
              
              <div className="flex-1 min-w-0 z-10">
                <div className={`text-xs ${showRoundResults ? 'text-yellow-400' : 'text-purple-400'} font-bold uppercase tracking-wider`}>
                    {showRoundResults ? 'Champion' : 'Legend'}
                </div>
                <div className="text-lg font-bold text-white truncate">{winner.nickname || winner.uniqueId}</div>
                <div className="text-sm text-gray-300 font-medium">{winner.score} Points</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 bg-gray-800/50 p-4 rounded-xl text-center text-sm border border-gray-700 border-dashed">
                No winners recorded.
            </div>
          )}
        </div>

        {/* Compact Top 10 List (Scrollable) */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-2 mb-4 no-scrollbar animate-fade-in">
          {runnersUp.length > 0 ? (
            runnersUp.map((player, index) => (
              <div key={`${player.uniqueId}-${showRoundResults}`} className="flex items-center justify-between bg-gray-800/40 hover:bg-gray-800 p-2 rounded-lg border border-gray-700/50 transition-colors animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`flex items-center justify-center w-5 h-5 ${showRoundResults ? 'bg-gray-700 text-gray-300' : 'bg-purple-900/50 text-purple-200'} rounded-full text-[10px] font-bold shrink-0`}>
                    #{index + 2}
                  </div>
                  <img src={player.profilePictureUrl} className="w-8 h-8 rounded-full object-cover border border-gray-600 shrink-0" alt="" />
                  <span className="text-xs font-medium text-gray-200 truncate">{player.nickname || player.uniqueId}</span>
                </div>
                <span className={`text-xs font-bold ${showRoundResults ? 'text-tiktok-cyan' : 'text-purple-400'} ml-2`}>{player.score} pts</span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600 text-xs py-4">
                {winner ? "Only one champion!" : "Waiting for players..."}
            </div>
          )}
        </div>

        {/* Footer: Timer & Button */}
        <div className="shrink-0 pt-2 border-t border-gray-800">
          <button 
            onClick={onRestart}
            className="w-full relative overflow-hidden bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 group border border-gray-700"
          >
            {/* Progress Bar Background */}
            <div 
              className="absolute left-0 top-0 bottom-0 bg-white/5 transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / 20) * 100}%` }}
            />
            
            <div className="relative z-10 flex items-center gap-2">
              {timeLeft > 0 ? (
                <>
                  <Timer size={18} className={timeLeft <= 3 ? "text-red-500 animate-pulse" : "text-tiktok-cyan"} />
                  <span className="text-sm">
                      {timeLeft > 10 ? `Showing Global in ${timeLeft - 10}s` : `Restarting in ${timeLeft}s`}
                  </span>
                </>
              ) : (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Starting...</span>
                </>
              )}
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};