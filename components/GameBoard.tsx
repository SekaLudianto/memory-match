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
}

export const GameBoard: React.FC<GameBoardProps> = ({ 
  cards, 
  connection, 
  lastEvent, 
  startGame,
  scores,
  status
}) => {
  return (
    <div className="flex flex-col h-full animate-fade-in relative">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-900/50 backdrop-blur-sm z-10 border-b border-gray-800/30">
        <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-tiktok-cyan to-tiktok-red w-8 h-8 rounded-lg flex items-center justify-center shadow-lg">
              <MonitorPlay size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">Memory Match</h1>
              <p className="text-[10px] text-gray-400">Interactive Live Game</p>
            </div>
        </div>

        <div className="flex items-center gap-2">
            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${connection.isConnected ? 'bg-green-900/30 border-green-500 text-green-400' : 'bg-red-900/30 border-red-500 text-red-400'} flex items-center gap-1`}>
              <div className={`w-1.5 h-1.5 rounded-full ${connection.isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              {connection.isConnected ? 'ONLINE' : 'OFFLINE'}
            </div>
            
            <button 
              onClick={startGame}
              className="bg-gray-800 p-1.5 rounded-full hover:bg-gray-700 transition-colors border border-gray-700 active:scale-95"
              title="Restart Game"
            >
              <RefreshCw size={14} />
            </button>
        </div>
      </div>

      {/* Instruction Banner */}
      <div className="bg-tiktok-cyan/10 border-b border-tiktok-cyan/20 px-4 py-2 flex items-center justify-center gap-2 shadow-sm relative z-10">
        <Info size={14} className="text-tiktok-cyan shrink-0" />
        <p className="text-xs text-gray-200 font-medium text-center">
          Cara main: Komen <span className="text-tiktok-cyan font-bold">2 angka</span> (contoh: <span className="font-mono text-white bg-gray-800/80 border border-gray-600 px-1.5 py-0.5 rounded text-[10px] mx-1">1 5</span>)
        </p>
      </div>

      {/* Game Grid Area */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 bg-gray-900/20 overflow-y-auto no-scrollbar relative">
        {connection.isConnected ? (
          <div className="w-full max-w-md aspect-square mb-16">
            <div className="grid grid-cols-4 gap-2 w-full h-full">
              {cards.map(card => (
                <Card key={card.id} card={card} />
              ))}
            </div>
          </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-3 pb-20">
              <MonitorPlay size={64} className="opacity-20" />
              <p className="text-sm">Connect in Settings to start playing</p>
            </div>
        )}
      </div>

      {/* Floating Status Toast */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none px-4 z-20">
          <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-700/50 shadow-2xl flex items-center gap-2 max-w-full">
            <MessageSquare size={14} className="text-tiktok-cyan flex-shrink-0" />
            <span className="text-xs font-mono text-white truncate">{lastEvent}</span>
          </div>
      </div>

      {/* Game Over Overlay - Shows Session Scores */}
      {status === GameStatus.GAME_OVER && (
        <GameOverOverlay scores={scores} onRestart={startGame} />
      )}
    </div>
  );
};