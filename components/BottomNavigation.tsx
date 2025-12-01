
import React from 'react';
import { Settings, Gamepad2, Trophy } from 'lucide-react';

type TabType = 'game' | 'settings' | 'leaderboard';

interface BottomNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-surface/90 backdrop-blur-xl border-t border-border fixed bottom-0 left-0 right-0 z-50 safe-area-bottom shadow-2xl transition-colors duration-300">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <button 
          onClick={() => setActiveTab('game')}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors active:scale-95 duration-200 ${activeTab === 'game' ? 'text-primary' : 'text-text-muted hover:text-text-main'}`}
        >
          <Gamepad2 size={24} strokeWidth={activeTab === 'game' ? 2.5 : 2} className="mb-1" />
          <span className="text-[10px] font-medium">Game</span>
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors active:scale-95 duration-200 ${activeTab === 'settings' ? 'text-primary' : 'text-text-muted hover:text-text-main'}`}
        >
          <Settings size={24} strokeWidth={activeTab === 'settings' ? 2.5 : 2} className="mb-1" />
          <span className="text-[10px] font-medium">Settings</span>
        </button>

        <button 
          onClick={() => setActiveTab('leaderboard')}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors active:scale-95 duration-200 ${activeTab === 'leaderboard' ? 'text-primary' : 'text-text-muted hover:text-text-main'}`}
        >
          <Trophy size={24} strokeWidth={activeTab === 'leaderboard' ? 2.5 : 2} className="mb-1" />
          <span className="text-[10px] font-medium">Rankings</span>
        </button>
      </div>
    </div>
  );
};
