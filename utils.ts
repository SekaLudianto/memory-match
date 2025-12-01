
import { CardItem, CardThemeMode } from './types';
import { 
  // Classic
  Ghost, Heart, Zap, Star, Moon, Sun, 
  Cloud, Umbrella, Music, Camera, Gift, Trophy,
  Flame, Anchor, Feather, Key,
  // Yummy (Food & Fruits)
  Apple, Banana, Cherry, Grape, Citrus, 
  Carrot, Pizza, IceCream, Cookie, Cake, 
  Candy, Lollipop, Coffee, Beer, Wine,
  // Animals
  Cat, Dog, Fish, Rabbit, Bird, Turtle, 
  Snail, Bug, PawPrint, Squirrel, Rat,
  // Tech
  Smartphone, Laptop, Wifi, Cpu, Database, 
  Server, Mouse, Keyboard, Gamepad, Headset, 
  Calculator, Monitor, Rocket, Bot
} from 'lucide-react';

// 1. DEFINE ICON SETS BY ID RANGES OR ARRAYS
// Classic: 0-15
// Yummy: 16-30
// Animals: 31-41
// Tech: 42-55

export const ICON_MAP: Record<number, any> = {
  // Set 1: Classic (Objects & Nature)
  0: Ghost, 1: Heart, 2: Zap, 3: Star, 4: Moon, 5: Sun, 
  6: Cloud, 7: Umbrella, 8: Music, 9: Camera, 10: Gift, 
  11: Trophy, 12: Flame, 13: Anchor, 14: Feather, 15: Key,
  
  // Set 2: Yummy (Fruits & Food)
  16: Apple, 17: Banana, 18: Cherry, 19: Grape, 20: Citrus, 
  21: Carrot, 22: Pizza, 23: IceCream, 24: Cookie, 25: Cake, 
  26: Candy, 27: Lollipop, 28: Coffee, 29: Beer, 30: Wine,

  // Set 3: Animals
  31: Cat, 32: Dog, 33: Fish, 34: Rabbit, 35: Bird, 36: Turtle,
  37: Snail, 38: Bug, 39: PawPrint, 40: Squirrel, 41: Rat,

  // Set 4: Tech
  42: Smartphone, 43: Laptop, 44: Wifi, 45: Cpu, 46: Database,
  47: Server, 48: Mouse, 49: Keyboard, 50: Gamepad, 51: Headset,
  52: Calculator, 53: Monitor, 54: Rocket, 55: Bot
};

// Helper to get ID arrays
const CLASSIC_IDS = Array.from({ length: 16 }, (_, i) => i); // 0-15
const YUMMY_IDS = Array.from({ length: 15 }, (_, i) => i + 16); // 16-30
const ANIMAL_IDS = Array.from({ length: 11 }, (_, i) => i + 31); // 31-41
const TECH_IDS = Array.from({ length: 14 }, (_, i) => i + 42); // 42-55

export const generateDeck = (gridSize: number, mode: CardThemeMode = 'mixed'): CardItem[] => {
  const totalCards = gridSize;
  const pairCount = totalCards / 2;
  
  let cards: CardItem[] = [];
  let availableIconIds: number[] = [];

  // 1. Select Pool based on Mode
  switch (mode) {
    case 'classic':
      availableIconIds = [...CLASSIC_IDS];
      break;
    case 'yummy':
      availableIconIds = [...YUMMY_IDS];
      break;
    case 'animals':
      availableIconIds = [...ANIMAL_IDS];
      break;
    case 'tech':
      availableIconIds = [...TECH_IDS];
      break;
    case 'mixed':
    default:
      // Combine all
      availableIconIds = [
        ...CLASSIC_IDS, 
        ...YUMMY_IDS, 
        ...ANIMAL_IDS, 
        ...TECH_IDS
      ];
      break;
  }
  
  // 2. Shuffle the available icons first
  // Ensure we have enough icons (duplicates allowed if pool is smaller than pairCount, 
  // but with these sets, min is 11, pairs is 10, so we are safe)
  for (let i = availableIconIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableIconIds[i], availableIconIds[j]] = [availableIconIds[j], availableIconIds[i]];
  }

  // 3. Select only the amount we need for this grid
  // If mixed, it picks random ones from all categories. 
  // If specific category, it picks random ones from that category.
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

  // 6. Re-assign distinct IDs
  return cards.map((card, index) => ({
    ...card,
    id: index + 1 // 1-based index
  }));
};