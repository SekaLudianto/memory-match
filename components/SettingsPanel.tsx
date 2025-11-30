import React from 'react';
import { ConnectionState, GameStatus } from '../types';
import { WifiOff, Info } from 'lucide-react';

interface SettingsPanelProps {
  username: string;
  setUsername: (username: string) => void;
  connection: ConnectionState;
  status: GameStatus;
  connectToTikTok: () => void;
  disconnect: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  username,
  setUsername,
  connection,
  status,
  connectToTikTok,
  disconnect
}) => {
  return (
    <div className="flex flex-col h-full p-6 animate-fade-in bg-tiktok-dark overflow-y-auto no-scrollbar pb-20">
      <h2 className="text-2xl font-bold mb-6 text-white">Setup Game</h2>
      
      <div className="space-y-6">
        {/* Connection Card */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 shadow-lg">
          <label className="text-xs font-bold text-gray-500 uppercase mb-3 block tracking-wider">Stream Connection</label>
          
          <div className="flex flex-col gap-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="tiktok_username"
                  className="w-full bg-black/40 border border-gray-700 rounded-xl py-3 pl-8 pr-4 text-white focus:border-tiktok-cyan focus:ring-1 focus:ring-tiktok-cyan focus:outline-none transition-all placeholder-gray-600"
                  disabled={connection.isConnected}
                />
              </div>

              {!connection.isConnected ? (
                <button 
                  onClick={connectToTikTok}
                  disabled={status === GameStatus.CONNECTING || !username}
                  className="w-full bg-tiktok-cyan hover:bg-cyan-400 text-black py-3 rounded-xl font-bold transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-[0_0_15px_rgba(37,244,238,0.3)]"
                >
                  {status === GameStatus.CONNECTING ? 'Connecting...' : 'Connect to Live'}
                </button>
              ) : (
                <button 
                  onClick={disconnect}
                  className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 py-3 rounded-xl font-bold transition-colors"
                >
                  Disconnect
                </button>
              )}
          </div>
          
          {connection.error && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-xs text-red-400 flex items-center gap-2">
                  <WifiOff size={14} /> {connection.error}
              </div>
          )}
        </div>

        {/* Rules Card */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 shadow-lg">
          <div className="flex items-center gap-2 mb-3 text-tiktok-cyan">
              <Info size={18} />
              <span className="font-bold text-sm">How to Play</span>
          </div>
          <ul className="text-sm text-gray-400 space-y-2 list-disc pl-4">
            <li>Connect to a TikTok Live stream.</li>
            <li>The game board will appear in the <strong>Game</strong> tab.</li>
            <li>Viewers must comment two numbers (e.g., <span className="text-white font-mono bg-gray-800 px-1 rounded">1 5</span>) to flip cards.</li>
            <li>If the icons match, the viewer gets a point!</li>
            <li>The game ends when all pairs are found.</li>
          </ul>
        </div>
        
        <div className="text-center text-xs text-gray-600 pt-4">
           v1.0.0 • TikTok Live Connector
        </div>
      </div>
    </div>
  );
};