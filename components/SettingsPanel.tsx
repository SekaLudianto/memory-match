import React, { useState, useEffect } from 'react';
import { ConnectionState, GameStatus, Theme, CardThemeMode } from '../types';
import { WifiOff, Info, Server, Lock, Palette, Moon, Sun, Smile, Image, Shuffle, Pizza, Zap, PawPrint, Users } from 'lucide-react';
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
  cardTheme: CardThemeMode;
  setCardTheme: (mode: CardThemeMode) => void;
  showAvatarBackgrounds: boolean; // New prop
  setShowAvatarBackgrounds: (show: boolean) => void; // New setter
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
  setTheme,
  cardTheme,
  setCardTheme,
  showAvatarBackgrounds,
  setShowAvatarBackgrounds
}) => {
  const [selectedServer, setSelectedServer] = useState(socketService.getBackendUrl());
  const isIndofinity = selectedServer.includes('ws://') || selectedServer.includes('62024');

  const handleServerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUrl = e.target.value;
    setSelectedServer(newUrl);
    socketService.setBackendUrl(newUrl);
  };

  const renderThemeButton = (theme: Theme, label: string, Icon: React.ElementType) => (
    <button 
      onClick={() => setTheme(theme)}
      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all active:scale-95 ${currentTheme === theme ? 'border-primary bg-surface-highlight' : 'border-transparent bg-background hover:bg-surface-highlight'}`}
    >
      <Icon size={20} className={`mb-2 ${currentTheme === theme ? 'text-primary' : 'text-text-muted'}`} />
      <span className="text-xs font-medium text-text-main">{label}</span>
    </button>
  );

  const renderCardThemeButton = (mode: CardThemeMode, label: string, Icon: React.ElementType) => (
    <button 
      onClick={() => setCardTheme(mode)}
      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all active:scale-95 ${cardTheme === mode ? 'border-secondary bg-surface-highlight' : 'border-transparent bg-background hover:bg-surface-highlight'}`}
    >
      <Icon size={20} className={`mb-2 ${cardTheme === mode ? 'text-secondary' : 'text-text-muted'}`} />
      <span className="text-[10px] font-medium text-text-main text-center leading-tight">{label}</span>
    </button>
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col p-6 animate-fade-in bg-background overflow-y-auto no-scrollbar pb-24">
      <h2 className="text-2xl font-bold mb-6 text-text-main">Setup Game</h2>
      
      <div className="space-y-6">
        
        {/* UI THEME SELECTOR */}
        <div className="bg-surface rounded-xl p-5 border border-border shadow-sm">
          <label className="text-xs font-bold text-text-muted uppercase mb-3 block tracking-wider flex items-center gap-2">
            <Palette size={14} /> UI Theme
          </label>
          <div className="grid grid-cols-3 gap-3">
            {renderThemeButton('dark', 'Dark', Moon)}
            {renderThemeButton('light', 'Light', Sun)}
            {renderThemeButton('cute', 'Cute', Smile)}
          </div>
        </div>

        {/* CARD IMAGE THEME SELECTOR */}
        <div className="bg-surface rounded-xl p-5 border border-border shadow-sm">
          <label className="text-xs font-bold text-text-muted uppercase mb-3 block tracking-wider flex items-center gap-2">
            <Image size={14} /> Card Images
          </label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {renderCardThemeButton('mixed', 'Campur', Shuffle)}
            {renderCardThemeButton('classic', 'Klasik', Zap)}
            {renderCardThemeButton('yummy', 'Yummy', Pizza)}
            {renderCardThemeButton('animals', 'Hewan', PawPrint)}
            {renderCardThemeButton('tech', 'Tech', Server)}
          </div>
          
          {/* NEW: Toggle for Avatar Backgrounds */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
             <div className="flex items-center gap-2 text-text-main">
                <Users size={16} className="text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold">Use Leaderboard Avatars</span>
                  <span className="text-[10px] text-text-muted">Fill cards with top players</span>
                </div>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showAvatarBackgrounds} 
                  onChange={(e) => setShowAvatarBackgrounds(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-surface-highlight peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary border border-border"></div>
              </label>
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
      </div>
    </div>
  );
};