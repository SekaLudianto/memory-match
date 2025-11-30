import React from 'react';
import { PlayerScore } from '../types';
import { Leaderboard } from './Leaderboard';

interface LeaderboardPanelProps {
  scores: PlayerScore[];
}

export const LeaderboardPanel: React.FC<LeaderboardPanelProps> = ({ scores }) => {
  return (
    <div className="h-full p-4 animate-fade-in pb-20 flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-white">Rankings</h2>
      <div className="flex-1 overflow-hidden">
         <Leaderboard scores={scores} />
      </div>
    </div>
  );
};