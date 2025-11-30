import React, { useState, useEffect } from 'react';
import { ConnectionState, GameStatus, Theme } from '../types';
import { WifiOff, Info, Server, Lock, Palette, Moon, Sun, Smile } from 'lucide-react';
import { socketService } from '../services/socket';

interface SettingsPanelProps {
  username: string;
  setUsername: (username: string) => void;
  connection: ConnectionState;
  status: GameStatus;
  connectToTikTok: () => void;
  disconnect: () => void;
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
}

const SERVER_OPTIONS = [
  { label: 'Public Server (Railway)', value: 'https://buat-lev.up.railway.app' },
  { label: 'Indofinity (Localhost)', value: 'ws://localhost:62024/' }
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  username,
  setUsername,
  connection,
  status,
  connectToTikTok,
  disconnect,
  currentTheme,
  setTheme
}) => {
  const [selectedServer, setSelectedServer] = useState(socketService.getBackendUrl());
  const isIndofinity = selectedServer.includes('ws://') || selectedServer.includes('62024');

  const handleServerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUrl = e.target.value;
    setSelectedServer(newUrl);
    socketService.setBackendUrl(newUrl);
  };

  useEffect(() => {
    if (isIndofinity) {
      // Optional logic
    }
  }, [isIndofinity]);

  return (
    <div className="flex flex-col h-full p-6 animate-fade-in bg-background overflow-y-auto no-scrollbar pb-24">
      <h2 className="text-2xl font-bold mb-6 text-text-main">Setup Game</h2>
      
      <div className="space-y-6">
        
        {/* THEME SELECTOR */}
        <div className="bg-surface rounded-xl p-5 border border-border shadow-sm">
          <label className="text-xs font-bold text-text-muted uppercase mb-3 block tracking-wider flex items-center gap-2">
            <Palette size={14} /> Appearance
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => setTheme('dark')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${currentTheme === 'dark' ? 'border-primary bg-surface-highlight' : 'border-transparent bg-background hover:bg-surface-highlight'}`}
            >
              <Moon size={20} className="mb-2 text-primary" />
              <span className="text-xs font-medium text-text-main">Dark</span>
            </button>
            <button 
              onClick={() => setTheme('light')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${currentTheme === 'light' ? 'border-primary bg-surface-highlight' : 'border-transparent bg-background hover:bg-surface-highlight'}`}
            >
              <Sun size={20} className="mb-2 text-primary" />
              <span className="text-xs font-medium text-text-main">Light</span>
            </button>
            <button 
              onClick={() => setTheme('cute')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${currentTheme === 'cute' ? 'border-primary bg-surface-highlight' : 'border-transparent bg-background hover:bg-surface-highlight'}`}
            >
              <Smile size={20} className="mb-2 text-primary" />
              <span className="text-xs font-medium text-text-main">Cute</span>
            </button>
          </div>
        </div>

        {/* Server Configuration */}
        <div className="bg-surface rounded-xl p-5 border border-border shadow-sm">
          <label className="text-xs font-bold text-text-muted uppercase mb-3 block tracking-wider">Backend Server</label>
          <div className="relative">
              <Server className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <select
                value={selectedServer}
                onChange={handleServerChange}
                disabled={connection.isConnected}
                className="w-full bg-background border border-border rounded-xl py-3 pl-11 pr-8 text-text-main focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all appearance-none disabled:opacity-50 cursor-pointer"
              >
                {SERVER_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
          </div>
          {isIndofinity && (
            <p className="text-[10px] text-green-500 mt-2 ml-1 flex items-center gap-1">
               <Info size={10} /> Indofinity Mode Active
            </p>
          )}
        </div>

        {/* Connection Card */}
        <div className="bg-surface rounded-xl p-5 border border-border shadow-sm">
          <label className="text-xs font-bold text-text-muted uppercase mb-3 block tracking-wider">Stream Connection</label>
          
          <div className="flex flex-col gap-4">
              <div className="relative">
                {isIndofinity ? (
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                ) : (
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">@</span>
                )}
                
                <input 
                  type="text" 
                  value={isIndofinity ? "Configured in Indofinity App" : username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={isIndofinity ? "No input needed" : "tiktok_username"}
                  className={`w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-text-main focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder-text-muted ${isIndofinity ? 'opacity-50 cursor-not-allowed italic' : ''}`}
                  disabled={connection.isConnected || isIndofinity}
                />
              </div>

              {!connection.isConnected ? (
                <button 
                  onClick={connectToTikTok}
                  disabled={status === GameStatus.CONNECTING || (!isIndofinity && !username)}
                  className="w-full bg-primary hover:opacity-90 text-background py-3 rounded-xl font-bold transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-md"
                >
                  {status === GameStatus.CONNECTING ? 'Connecting...' : (isIndofinity ? 'Connect Indofinity' : 'Connect to Live')}
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
        <div className="bg-surface rounded-xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-primary">
              <Info size={18} />
              <span className="font-bold text-sm">How to Play</span>
          </div>
          <ul className="text-sm text-text-muted space-y-2 list-disc pl-4">
            <li>
               <strong>Server:</strong> Choose <em>Public</em> for generic use, or <em>Indofinity</em> for local tools.
            </li>
            <li>
               {isIndofinity 
                 ? "Setup the target username inside your Indofinity application."
                 : "Enter the TikTok Username you want to connect to."
               }
            </li>
            <li>Connect to the stream.</li>
            <li>Viewers must comment two numbers (e.g., <span className="text-primary font-mono bg-background border border-border px-1 rounded">1 5</span>) to flip cards.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};