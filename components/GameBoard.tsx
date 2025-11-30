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
}

export const GameBoard: React.FC<GameBoardProps> = ({ 
  cards, 
  connection, 
  lastEvent, 
  startGame,
  scores,
  status,
  globalScores = []
}) => {
  return (
    <div className="flex flex-col h-full animate-fade-in relative bg-background">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-surface/80 backdrop-blur-sm z-10 border-b border-border shadow-sm">
        <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-secondary w-8 h-8 rounded-lg flex items-center justify-center shadow-lg">
              <MonitorPlay size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none text-text-main">Memory Match</h1>
              <p className="text-[10px] text-text-muted">Interactive Live Game</p>
            </div>
        </div>

        <div className="flex items-center gap-2">
            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${connection.isConnected ? 'bg-green-500/20 border-green-500 text-green-600' : 'bg-red-500/20 border-red-500 text-red-600'} flex items-center gap-1`}>
              <div className={`w-1.5 h-1.5 rounded-full ${connection.isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              {connection.isConnected ? 'ONLINE' : 'OFFLINE'}
            </div>
            
            <button 
              onClick={startGame}
              className="bg-surface p-1.5 rounded-full hover:bg-surface-highlight transition-colors border border-border active:scale-95 text-text-main"
              title="Restart Game"
            >
              <RefreshCw size={14} />
            </button>
        </div>
      </div>

      {/* Instruction Banner */}
      <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 flex items-center justify-center gap-2 shadow-sm relative z-10">
        <Info size={14} className="text-primary shrink-0" />
        <p className="text-xs text-text-main font-medium text-center">
          Cara main: Komen <span className="text-primary font-bold">2 angka</span> (contoh: <span className="font-mono text-primary bg-surface border border-border px-1.5 py-0.5 rounded text-[10px] mx-1">1 5</span>)
        </p>
      </div>

      {/* Game Grid Area - Show if Connected OR if we have data (Resume Mode) */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 overflow-y-auto no-scrollbar relative">
        {connection.isConnected || cards.length > 0 ? (
          <div className="w-full max-w-md mb-24">
            <div className="grid grid-cols-4 gap-2 w-full">
              {cards.map(card => (
                <Card key={card.id} card={card} />
              ))}
            </div>
          </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-text-muted space-y-3 pb-20">
              <MonitorPlay size={64} className="opacity-20" />
              <p className="text-sm">Connect in Settings to start playing</p>
            </div>
        )}
      </div>

      {/* Floating Status Toast */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none px-4 z-20">
          <div className="bg-surface/90 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-xl flex items-center gap-2 max-w-full">
            <MessageSquare size={14} className="text-primary flex-shrink-0" />
            <span className="text-xs font-mono text-text-main truncate">{lastEvent}</span>
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