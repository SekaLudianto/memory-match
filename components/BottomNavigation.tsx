import React from 'react';
import { Settings, Gamepad2, Trophy } from 'lucide-react';

type TabType = 'game' | 'settings' | 'leaderboard';

interface BottomNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-gray-900/95 backdrop-blur-md border-t border-gray-800 fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <button 
          onClick={() => setActiveTab('game')}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'game' ? 'text-tiktok-cyan' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Gamepad2 size={24} strokeWidth={activeTab === 'game' ? 2.5 : 2} className="mb-1 transition-transform active:scale-90" />
          <span className="text-[10px] font-medium">Game</span>
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'settings' ? 'text-tiktok-cyan' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Settings size={24} strokeWidth={activeTab === 'settings' ? 2.5 : 2} className="mb-1 transition-transform active:scale-90" />
          <span className="text-[10px] font-medium">Settings</span>
        </button>

        <button 
          onClick={() => setActiveTab('leaderboard')}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'leaderboard' ? 'text-tiktok-cyan' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Trophy size={24} strokeWidth={activeTab === 'leaderboard' ? 2.5 : 2} className="mb-1 transition-transform active:scale-90" />
          <span className="text-[10px] font-medium">Rankings</span>
        </button>
      </div>
    </div>
  );
};