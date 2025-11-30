export interface TikTokProfile {
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
}

export interface ChatMessage {
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  comment: string;
}

export interface CardItem {
  id: number;
  iconId: number; // The logic ID (e.g., 0-7 for pairs)
  isFlipped: boolean;
  isMatched: boolean;
  matchedBy?: string; // uniqueId of the user who matched it
}

export interface PlayerScore {
  uniqueId: string;
  profilePictureUrl: string;
  score: number;
  lastMatchTime: number;
}

export enum GameStatus {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

export interface ConnectionState {
  isConnected: boolean;
  roomId: string | null;
  error: string | null;
}