import React, { useState, useEffect, useRef, useCallback } from 'react';
import { socketService } from './services/socket';
import { CardItem, GameStatus, PlayerScore, ChatMessage, ConnectionState } from './types';
import { generateDeck } from './utils';

// Components
import { GameBoard } from './components/GameBoard';
import { SettingsPanel } from './components/SettingsPanel';
import { LeaderboardPanel } from './components/LeaderboardPanel';
import { BottomNavigation } from './components/BottomNavigation';

const GRID_SIZE = 16; // 4x4 grid
const LEADERBOARD_STORAGE_KEY = 'TIKTOK_MEMORY_LEADERBOARD';

const App: React.FC = () => {
  // Game State
  const [cards, setCards] = useState<CardItem[]>([]);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastEvent, setLastEvent] = useState<string>('Waiting for comments...');
  
  // Scoring State
  // sessionScores: Resets every game (for Game Over screen)
  const [sessionScores, setSessionScores] = useState<PlayerScore[]>([]); 
  // leaderboard: Persists forever (for Rankings tab)
  const [leaderboard, setLeaderboard] = useState<PlayerScore[]>(() => {
    try {
      const stored = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load leaderboard", e);
      return [];
    }
  });
  
  // Connection State
  const [username, setUsername] = useState<string>('');
  const [connection, setConnection] = useState<ConnectionState>({
    isConnected: false,
    roomId: null,
    error: null
  });

  // UI State: 'game', 'settings', 'leaderboard'
  const [activeTab, setActiveTab] = useState<'game' | 'settings' | 'leaderboard'>('game');

  // Refs
  const processingRef = useRef(false);
  const cardsRef = useRef<CardItem[]>([]);
  const statusRef = useRef(status);
  
  // Sync ref with state
  useEffect(() => {
    cardsRef.current = cards;
    processingRef.current = isProcessing;
    statusRef.current = status;
  }, [cards, isProcessing, status]);

  // Persist Leaderboard whenever it changes
  useEffect(() => {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(leaderboard));
  }, [leaderboard]);

  // Initialize Game
  const startGame = useCallback(() => {
    // Generate new deck (random images thanks to updated utils.ts)
    const newDeck = generateDeck(GRID_SIZE);
    setCards(newDeck);
    
    // Reset session scores, but keep leaderboard
    setSessionScores([]);
    
    setIsProcessing(false);
    setStatus(GameStatus.PLAYING);
    setLastEvent('Game Started! Type two numbers (e.g., "1 5") to flip!');
  }, []);

  // Helper to update scores
  const updatePlayerScore = (list: PlayerScore[], player: ChatMessage, points: number): PlayerScore[] => {
    const existingIndex = list.findIndex(p => p.uniqueId === player.uniqueId);
    if (existingIndex > -1) {
      // Update existing
      const newList = [...list];
      newList[existingIndex] = {
        ...newList[existingIndex],
        score: newList[existingIndex].score + points,
        lastMatchTime: Date.now(),
        profilePictureUrl: player.profilePictureUrl // Update pic if changed
      };
      return newList;
    } else {
      // Add new
      return [...list, {
        uniqueId: player.uniqueId,
        profilePictureUrl: player.profilePictureUrl,
        score: points,
        lastMatchTime: Date.now()
      }];
    }
  };

  // Logic to process a move
  const handleMoveAttempt = useCallback((firstId: number, secondId: number, player: ChatMessage) => {
    if (processingRef.current) return;
    
    const currentCards = cardsRef.current;
    
    // Validate Indices (1-based from user)
    const card1Index = currentCards.findIndex(c => c.id === firstId);
    const card2Index = currentCards.findIndex(c => c.id === secondId);

    // Validation checks
    if (card1Index === -1 || card2Index === -1) return; // Invalid IDs
    if (card1Index === card2Index) return; // Same card
    if (currentCards[card1Index].isMatched || currentCards[card2Index].isMatched) return; // Already matched
    if (currentCards[card1Index].isFlipped || currentCards[card2Index].isFlipped) return; // Already currently flipped

    // Lock game logic
    setIsProcessing(true);
    setLastEvent(`${player.uniqueId} guessed ${firstId} & ${secondId}...`);

    // 1. Flip Cards
    setCards(prev => prev.map((c, i) => 
      (i === card1Index || i === card2Index) ? { ...c, isFlipped: true } : c
    ));

    // 2. Check Match after delay
    setTimeout(() => {
      const c1 = currentCards[card1Index];
      const c2 = currentCards[card2Index];
      
      if (c1.iconId === c2.iconId) {
        // MATCH FOUND
        setCards(prev => prev.map((c, i) => 
          (i === card1Index || i === card2Index) 
            ? { ...c, isMatched: true, isFlipped: true, matchedBy: player.uniqueId } 
            : c
        ));
        
        // Update Session Scores (Current Game)
        setSessionScores(prev => updatePlayerScore(prev, player, 1));
        
        // Update Persistent Leaderboard (Accumulate)
        setLeaderboard(prev => updatePlayerScore(prev, player, 1));

        setLastEvent(`✅ MATCH! ${player.uniqueId} gets a point!`);
        
        // Check Game Over
        const unmatchedCount = cardsRef.current.filter(c => !c.isMatched).length - 2; // -2 because we just matched 2
        if (unmatchedCount <= 0) {
          setStatus(GameStatus.GAME_OVER);
          setLastEvent("🏆 GAME OVER! All pairs found!");
        }

      } else {
        // NO MATCH - Flip back
        setCards(prev => prev.map((c, i) => 
          (i === card1Index || i === card2Index) ? { ...c, isFlipped: false } : c
        ));
        setLastEvent(`❌ No match. Try again!`);
      }

      setIsProcessing(false);
    }, 1500); // 1.5s delay to see the cards
  }, []);

  // Handle Socket Events
  useEffect(() => {
    const handleConnected = (state: any) => {
      setConnection({
        isConnected: true,
        roomId: state.roomId,
        error: null
      });
      // Auto start game on connection
      setStatus(GameStatus.PLAYING);
      startGame();
      setActiveTab('game');
    };

    const handleDisconnected = (msg: string) => {
      setConnection(prev => ({ ...prev, isConnected: false, error: msg }));
      setStatus(GameStatus.IDLE);
    };

    const handleChat = (msg: ChatMessage) => {
      if (statusRef.current !== GameStatus.PLAYING) return;
      
      const comment = msg.comment.trim();
      
      // Regex to find two numbers
      const match = comment.match(/(\d+)\s+[^\d]*(\d+)/) || comment.match(/(\d+)[^\d]+(\d+)/);
      
      if (match) {
        const first = parseInt(match[1]);
        const second = parseInt(match[2]);
        handleMoveAttempt(first, second, msg);
      }
    };

    const handleStreamEnd = () => handleDisconnected('Stream Ended');

    socketService.on('connected', handleConnected);
    socketService.on('disconnected', handleDisconnected);
    socketService.on('chat', handleChat);
    socketService.on('streamEnd', handleStreamEnd);

    return () => {
      socketService.off('connected', handleConnected);
      socketService.off('disconnected', handleDisconnected);
      socketService.off('chat', handleChat);
      socketService.off('streamEnd', handleStreamEnd);
      socketService.disconnect();
    };
  }, [startGame, handleMoveAttempt]); 

  const connectToTikTok = () => {
    if (!username) return;
    setStatus(GameStatus.CONNECTING);
    socketService.connect(username);
  };

  const disconnectTikTok = () => {
    socketService.disconnect();
  };

  return (
    <div className="h-screen bg-tiktok-dark text-white font-sans overflow-hidden flex flex-col">
      
      {/* Content Area - Switches based on activeTab */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'game' && (
          <GameBoard 
            cards={cards} 
            connection={connection} 
            lastEvent={lastEvent} 
            startGame={startGame}
            scores={sessionScores} // Game Board/Over screen shows current session scores
            status={status}
          />
        )}
        
        {activeTab === 'settings' && (
          <SettingsPanel 
            username={username}
            setUsername={setUsername}
            connection={connection}
            status={status}
            connectToTikTok={connectToTikTok}
            disconnect={disconnectTikTok}
          />
        )}
        
        {activeTab === 'leaderboard' && (
          <LeaderboardPanel scores={leaderboard} /> // Rankings tab shows All-Time scores
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
    </div>
  );
};

export default App;