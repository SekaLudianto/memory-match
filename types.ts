export type Theme = 'dark' | 'light' | 'cute';

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
  matchedBy?: string; // Display name (nickname) of the user who matched it
  matchedByAvatar?: string; // URL of the user's profile picture
}

export interface PlayerScore {
  uniqueId: string;
  nickname?: string; // Add nickname field
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