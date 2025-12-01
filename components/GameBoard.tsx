import React from 'react';
import { CardItem, ConnectionState, PlayerScore, GameStatus } from '../types';
import { Card } from './Card';
import { MonitorPlay, RefreshCw, MessageSquare, Info } from 'lucide-react';
import { GameOverOverlay } from './GameOverOverlay';

interface GameBoardProps {
  cards: CardItem[];
  connection: ConnectionState;
  lastEvent: string;
  startGame: () => void;
  scores: PlayerScore[];
  status: GameStatus;
  globalScores?: PlayerScore[];
  showAvatarBackgrounds?: boolean; // New prop
}

export const GameBoard: React.FC<GameBoardProps> = ({ 
  cards, 
  connection, 
  lastEvent, 
  startGame,
  scores,
  status,
  globalScores = [],
  showAvatarBackgrounds = false
}) => {
  
  // Get Top 20 Global Players sorted by score
  const top20Players = React.useMemo(() => {
    return [...globalScores]
      .sort((a, b) => b.score - a.score || a.lastMatchTime - b.lastMatchTime)
      .slice(0, 20); // Limit to top 20 for the 20 cards
  }, [globalScores]);

  return (
    <div className="flex flex-col h-full animate-fade-in relative bg-background bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-surface/50 via-background to-background">
      
      {/* Header - Glass Effect */}
      <div className="flex-none flex justify-between items-center px-4 py-3 bg-surface/80 backdrop-blur-lg z-10 border-b border-border shadow-sm sticky top-0">
        <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-secondary w-8 h-8 rounded-lg flex items-center justify-center shadow-lg ring-1 ring-white/10">
              <MonitorPlay size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none text-text-main tracking-tight">Memory Match</h1>
              <p className="text-[10px] text-text-muted font-medium">Interactive Live Game</p>
            </div>
        </div>

        <div className="flex items-center gap-2">
            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${connection.isConnected ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'} flex items-center gap-1 backdrop-blur-sm`}>
              <div className={`w-1.5 h-1.5 rounded-full ${connection.isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              {connection.isConnected ? 'LIVE' : 'OFFLINE'}
            </div>
            
            <button 
              onClick={startGame}
              className="bg-surface/50 p-2 rounded-full hover:bg-surface-highlight transition-all border border-border active:scale-95 text-text-main shadow-sm"
              title="Restart Game"
            >
              <RefreshCw size={14} />
            </button>
        </div>
      </div>

      {/* Instruction Banner */}
      <div className="flex-none bg-primary/5 border-b border-primary/10 px-4 py-2 flex items-center justify-center gap-2 relative z-10 backdrop-blur-sm">
        <Info size={14} className="text-primary shrink-0" />
        <p className="text-xs text-text-main font-medium text-center">
          Komen <span className="text-primary font-bold">2 angka</span> (contoh: <span className="font-mono text-primary bg-surface/50 border border-border px-1.5 py-0.5 rounded text-[10px] mx-1 shadow-sm">1 5</span>)
        </p>
      </div>

      {/* Game Grid Area */}
      <div className="flex-1 min-h-0 flex flex-col justify-center items-center p-4 overflow-y-auto no-scrollbar relative pb-24">
        {connection.isConnected || cards.length > 0 ? (
          <div className="w-full max-w-md animate-fade-in">
            <div className="grid grid-cols-4 gap-3 w-full p-2">
              {cards.map((card, index) => {
                // Determine background avatar based on card index
                // Card 0 gets TopPlayer 0, etc.
                const bgAvatar = showAvatarBackgrounds && top20Players[index] 
                  ? top20Players[index].profilePictureUrl 
                  : undefined;

                return (
                  <Card 
                    key={card.id} 
                    card={card} 
                    backgroundAvatar={bgAvatar} // Use specific avatar
                  />
                );
              })}
            </div>
          </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-text-muted space-y-4">
              <div className="p-6 rounded-full bg-surface border border-border shadow-inner">
                 <MonitorPlay size={48} className="opacity-30" />
              </div>
              <p className="text-sm font-medium">Connect in Settings to start playing</p>
            </div>
        )}
      </div>

      {/* Floating Status Toast */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none px-4 z-20 mb-16">
          <div className="bg-surface/90 backdrop-blur-xl px-4 py-2.5 rounded-full border border-border shadow-2xl flex items-center gap-2 max-w-full ring-1 ring-white/5">
            <MessageSquare size={14} className="text-primary flex-shrink-0" />
            <span className="text-xs font-mono text-text-main truncate font-medium">{lastEvent}</span>
          </div>
      </div>

      {/* Game Over Overlay */}
      {status === GameStatus.GAME_OVER && (
        <GameOverOverlay 
          scores={scores} 
          globalScores={globalScores}
          onRestart={startGame} 
        />
      )}
    </div>
  );
};