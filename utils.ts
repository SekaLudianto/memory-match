import { CardItem } from './types';
import { 
  Ghost, Heart, Zap, Star, Moon, Sun, 
  Cloud, Umbrella, Music, Camera, Gift, Trophy,
  Flame, Anchor, Feather, Key,
  // Fruits & Food Expansion
  Apple, Banana, Cherry, Grape, Citrus, 
  Carrot, Pizza, IceCream, Cookie, Cake, 
  Candy, Lollipop, Coffee, Beer, Wine
} from 'lucide-react';

// Map icon IDs to Lucide components for rendering
// Extended list to provide more variety
export const ICON_MAP: Record<number, any> = {
  // Set 1: Objects & Nature
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
  15: Key,
  
  // Set 2: Fruits (Buah-buahan)
  16: Apple,
  17: Banana,
  18: Cherry,
  19: Grape,
  20: Citrus, // Lemon/Orange
  
  // Set 3: Food & Drinks (Makanan)
  21: Carrot,
  22: Pizza,
  23: IceCream,
  24: Cookie,
  25: Cake,
  26: Candy,
  27: Lollipop,
  28: Coffee,
  29: Beer,
  30: Wine
};

export const generateDeck = (gridSize: number): CardItem[] => {
  const totalCards = gridSize;
  const pairCount = totalCards / 2;
  
  let cards: CardItem[] = [];
  
  // 1. Get all available icon IDs
  const availableIconIds = Object.keys(ICON_MAP).map(Number);
  
  // 2. Shuffle the available icons first (Ensures variety each session)
  // This logic ensures we pick a RANDOM set of icons from our pool
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