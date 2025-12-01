import React from 'react';
import { CardItem } from '../types';
import { ICON_MAP } from '../utils';
import { HelpCircle } from 'lucide-react';

interface CardProps {
  card: CardItem;
  backgroundAvatar?: string; // Updated prop name
}

export const Card: React.FC<CardProps> = ({ card, backgroundAvatar }) => {
  const Icon = ICON_MAP[card.iconId];
  const isEmoji = typeof Icon === 'string';

  return (
    <div className="relative w-full aspect-square group perspective-1000">
      <div 
        className={`relative w-full h-full duration-500 transform-style-3d transition-all ${
          card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front Face (Hidden/Number) */}
        {/* PREMIUM LOOK: Added ring-1 ring-inset for inner border effect & subtle gradient */}
        <div 
          className={`absolute w-full h-full backface-hidden rounded-xl flex items-center justify-center shadow-lg transition-all ring-1 ring-inset overflow-hidden
            ${card.isMatched 
              ? 'bg-surface ring-border opacity-40' 
              : 'bg-gradient-to-br from-card-hidden to-surface-highlight ring-white/10 dark:ring-white/10 ring-black/5 hover:ring-primary/50 hover:shadow-primary/20' 
            }
          `}
        >
          {/* Avatar Background (If provided and not matched yet) */}
          {!card.isMatched && backgroundAvatar && (
            <div className="absolute inset-0 z-0 pointer-events-none">
               <img 
                 src={backgroundAvatar} 
                 alt="bg" 
                 className="w-full h-full object-cover opacity-20 grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-40"
               />
               <div className="absolute inset-0 bg-background/30 mix-blend-overlay" /> 
            </div>
          )}

          <div className="flex flex-col items-center relative z-10">
            {/* Added drop-shadow to text for depth */}
            <span className={`text-3xl font-bold text-card-text drop-shadow-md ${!card.isMatched && 'group-hover:scale-110 transition-transform'}`}>
              {card.id}
            </span>
          </div>
        </div>

        {/* Back Face (Revealed/Icon) */}
        <div 
          className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-xl flex flex-col items-center justify-center shadow-xl transition-all ring-1 ring-inset
             ${card.isMatched 
               ? 'bg-green-500/10 ring-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
               : 'bg-gradient-to-br from-card-revealed to-surface ring-border shadow-md' 
             }
          `}
        >
          {Icon ? (
            isEmoji ? (
              <span className="text-4xl drop-shadow-md select-none animate-bounce-short">
                {Icon}
              </span>
            ) : (
              <Icon 
                className={`w-1/2 h-1/2 ${card.isMatched ? 'text-green-500' : 'text-secondary'} drop-shadow-md`} 
                strokeWidth={2.5}
              />
            )
          ) : (
            <HelpCircle className="text-text-muted" />
          )}
          
          {/* Winner Badge with Avatar */}
          {card.matchedBy && (
            <div className="absolute bottom-1 w-full flex justify-center items-center px-1 animate-fade-in">
               <div className="bg-surface/90 backdrop-blur-md pl-0.5 pr-2 py-0.5 rounded-full flex items-center gap-1.5 max-w-full border border-border/50 shadow-lg">
                 {card.matchedByAvatar && (
                   <img 
                     src={card.matchedByAvatar} 
                     className="w-4 h-4 rounded-full border border-primary object-cover flex-shrink-0" 
                     alt="" 
                   />
                 )}
                 <span className="text-[0.6rem] text-text-main truncate font-bold">
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