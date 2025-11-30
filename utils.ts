import { CardItem } from './types';
import { 
  Ghost, Heart, Zap, Star, Moon, Sun, 
  Cloud, Umbrella, Music, Camera, Gift, Trophy,
  Flame, Anchor, Feather, Key
} from 'lucide-react';

// Map icon IDs to Lucide components for rendering
// Extended list to provide more variety
export const ICON_MAP: Record<number, any> = {
  0: Ghost,
  1: Heart,
  2: Zap,
  3: Star,
  4: Moon,
  5: Sun,
  6: Cloud,
  7: Umbrella,
  8: Music,
  9: Camera,
  10: Gift,
  11: Trophy,
  12: Flame,
  13: Anchor,
  14: Feather,
  15: Key
};

export const generateDeck = (gridSize: number): CardItem[] => {
  const totalCards = gridSize;
  const pairCount = totalCards / 2;
  
  let cards: CardItem[] = [];
  
  // 1. Get all available icon IDs
  const availableIconIds = Object.keys(ICON_MAP).map(Number);
  
  // 2. Shuffle the available icons first (Ensures variety each session)
  for (let i = availableIconIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableIconIds[i], availableIconIds[j]] = [availableIconIds[j], availableIconIds[i]];
  }

  // 3. Select only the amount we need for this grid
  const selectedIcons = availableIconIds.slice(0, pairCount);
  
  // 4. Create pairs using the selected random icons
  for (let i = 0; i < pairCount; i++) {
    const iconId = selectedIcons[i];
    
    // We create two cards with the same iconId
    cards.push({
      id: 0, // Temp ID, will be overwritten
      iconId: iconId,
      isFlipped: false,
      isMatched: false
    });
    cards.push({
      id: 0, // Temp ID, will be overwritten
      iconId: iconId,
      isFlipped: false,
      isMatched: false
    });
  }
  
  // 5. Fisher-Yates Shuffle the deck positions
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  // 6. Re-assign distinct IDs based on new position so user says "1" for the first card
  return cards.map((card, index) => ({
    ...card,
    id: index + 1 // 1-based index for user friendliness
  }));
};