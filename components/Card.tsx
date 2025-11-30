import React from 'react';
import { CardItem } from '../types';
import { ICON_MAP } from '../utils';
import { HelpCircle } from 'lucide-react';

interface CardProps {
  card: CardItem;
}

export const Card: React.FC<CardProps> = ({ card }) => {
  const Icon = ICON_MAP[card.iconId];

  return (
    <div className="relative w-full aspect-square group perspective-1000">
      <div 
        className={`relative w-full h-full duration-500 transform-style-3d transition-all ${
          card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front Face (Hidden/Number) */}
        <div 
          className={`absolute w-full h-full backface-hidden rounded-xl border-2 flex items-center justify-center shadow-lg
            ${card.isMatched 
              ? 'bg-gray-800 border-gray-700 opacity-50' 
              : 'bg-gradient-to-br from-tiktok-dark to-gray-800 border-tiktok-cyan'
            }
          `}
        >
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-tiktok-cyan drop-shadow-[0_0_10px_rgba(37,244,238,0.5)]">
              {card.id}
            </span>
          </div>
        </div>

        {/* Back Face (Revealed/Icon) */}
        <div 
          className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-xl border-2 flex flex-col items-center justify-center shadow-lg
             ${card.isMatched 
               ? 'bg-green-900/30 border-green-500' 
               : 'bg-gradient-to-br from-tiktok-red to-pink-900 border-tiktok-red'
             }
          `}
        >
          {Icon ? (
            <Icon 
              className={`w-1/2 h-1/2 ${card.isMatched ? 'text-green-400' : 'text-white'} drop-shadow-md`} 
              strokeWidth={2.5}
            />
          ) : (
            <HelpCircle className="text-white" />
          )}
          
          {/* Winner Badge with Avatar */}
          {card.matchedBy && (
            <div className="absolute bottom-1 w-full flex justify-center items-center px-1">
               <div className="bg-black/70 pl-0.5 pr-2 py-0.5 rounded-full flex items-center gap-1.5 max-w-full">
                 {card.matchedByAvatar && (
                   <img 
                     src={card.matchedByAvatar} 
                     className="w-4 h-4 rounded-full border border-tiktok-cyan object-cover flex-shrink-0" 
                     alt="" 
                   />
                 )}
                 <span className="text-[0.6rem] text-white truncate font-medium">
                   {card.matchedBy}
                 </span>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};