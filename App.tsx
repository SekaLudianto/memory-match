import React, { useState, useEffect, useRef, useCallback } from 'react';
import { socketService } from './services/socket';
import { CardItem, GameStatus, PlayerScore, ChatMessage, ConnectionState, Theme } from './types';
import { generateDeck } from './utils';

// Components
import { GameBoard } from './components/GameBoard';
import { SettingsPanel } from './components/SettingsPanel';
import { LeaderboardPanel } from './components/LeaderboardPanel';
import { BottomNavigation } from './components/BottomNavigation';
import { GameOverOverlay } from './components/GameOverOverlay';

const GRID_SIZE = 20; // 5x4 grid
const LEADERBOARD_STORAGE_KEY = 'TIKTOK_MEMORY_LEADERBOARD';
const THEME_STORAGE_KEY = 'TIKTOK_MEMORY_THEME';

// Interface untuk item di dalam antrian
interface MoveRequest {
  firstId: number;
  secondId: number;
  player: ChatMessage;
}

const App: React.FC = () => {
  // Theme State
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    return (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || 'dark';
  });

  // Game State
  const [cards, setCards] = useState<CardItem[]>([]);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastEvent, setLastEvent] = useState<string>('Waiting for comments...');
  
  // Scoring State
  const [sessionScores, setSessionScores] = useState<PlayerScore[]>([]); 
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
  
  // QUEUE SYSTEM REF
  const moveQueueRef = useRef<MoveRequest[]>([]);

  // Sync ref with state
  useEffect(() => {
    cardsRef.current = cards;
    processingRef.current = isProcessing;
    statusRef.current = status;
  }, [cards, isProcessing, status]);

  // Persist Data
  useEffect(() => {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(leaderboard));
  }, [leaderboard]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
  }, [currentTheme]);

  // Initialize Game
  const startGame = useCallback(() => {
    const newDeck = generateDeck(GRID_SIZE);
    setCards(newDeck);
    
    // Reset session vars
    setSessionScores([]);
    moveQueueRef.current = []; // Clear queue on new game
    
    setIsProcessing(false);
    setStatus(GameStatus.PLAYING);
    setLastEvent('Game Started! Type two numbers (e.g., "1 5") to flip!');
  }, []);

  // Helper to update scores
  const updatePlayerScore = (list: PlayerScore[], player: ChatMessage, points: number): PlayerScore[] => {
    const existingIndex = list.findIndex(p => p.uniqueId === player.uniqueId);
    if (existingIndex > -1) {
      const newList = [...list];
      newList[existingIndex] = {
        ...newList[existingIndex],
        nickname: player.nickname,
        score: newList[existingIndex].score + points,
        lastMatchTime: Date.now(),
        profilePictureUrl: player.profilePictureUrl
      };
      return newList;
    } else {
      return [...list, {
        uniqueId: player.uniqueId,
        nickname: player.nickname,
        profilePictureUrl: player.profilePictureUrl,
        score: points,
        lastMatchTime: Date.now()
      }];
    }
  };

  // CORE LOGIC: Execute Move
  const executeMove = useCallback((firstId: number, secondId: number, player: ChatMessage) => {
    const currentCards = cardsRef.current;
    
    // --- VALIDATION LAYER ---
    const card1Index = currentCards.findIndex(c => c.id === firstId);
    const card2Index = currentCards.findIndex(c => c.id === secondId);

    // Invalid IDs or Same Card or Already Matched/Flipped
    if (card1Index === -1 || card2Index === -1 || 
        card1Index === card2Index || 
        currentCards[card1Index].isMatched || currentCards[card2Index].isMatched ||
        currentCards[card1Index].isFlipped || currentCards[card2Index].isFlipped
    ) {
      // Jika move tidak valid, langsung cek antrian berikutnya tanpa delay
      processNextInQueue();
      return;
    }

    // --- EXECUTION LAYER ---
    setIsProcessing(true); // Lock visual processing
    setLastEvent(`${player.nickname} guessed ${firstId} & ${secondId}...`);

    // 1. Flip Cards Visual
    setCards(prev => prev.map((c, i) => 
      (i === card1Index || i === card2Index) ? { ...c, isFlipped: true } : c
    ));

    // 2. Logic Evaluation (Delayed)
    setTimeout(() => {
      const c1 = currentCards[card1Index];
      const c2 = currentCards[card2Index];
      
      if (c1.iconId === c2.iconId) {
        // MATCH FOUND
        setCards(prev => prev.map((c, i) => 
          (i === card1Index || i === card2Index) 
            ? { 
                ...c, 
                isMatched: true, 
                isFlipped: true, 
                matchedBy: player.nickname,
                matchedByAvatar: player.profilePictureUrl 
              } 
            : c
        ));
        
        setSessionScores(prev => updatePlayerScore(prev, player, 1));
        setLeaderboard(prev => updatePlayerScore(prev, player, 1));
        setLastEvent(`✅ MATCH! ${player.nickname} gets a point!`);
        
        // Check Game Over
        const remainingUnmatched = cardsRef.current.filter(c => !c.isMatched).length - 2; 
        if (remainingUnmatched <= 0) {
          setStatus(GameStatus.GAME_OVER);
          setLastEvent("🏆 GAME OVER! All pairs found!");
          setIsProcessing(false);
          moveQueueRef.current = []; // Clear queue on win
          return;
        }

      } else {
        // NO MATCH - Flip back
        setCards(prev => prev.map((c, i) => 
          (i === card1Index || i === card2Index) ? { ...c, isFlipped: false } : c
        ));
        setLastEvent(`❌ No match. Try again!`);
      }

      // 3. Process Next Item in Queue
      processNextInQueue();

    }, 1500); // Durasi animasi kartu terbuka
  }, []);

  // QUEUE PROCESSOR
  const processNextInQueue = useCallback(() => {
    if (moveQueueRef.current.length > 0) {
      // Ambil item pertama (FIFO)
      const nextMove = moveQueueRef.current.shift(); 
      if (nextMove) {
        executeMove(nextMove.firstId, nextMove.secondId, nextMove.player);
      }
    } else {
      // Antrian kosong, buka kunci
      setIsProcessing(false);
    }
  }, [executeMove]);

  // PUBLIC HANDLER: Called by Socket Event
  const handleMoveRequest = useCallback((firstId: number, secondId: number, player: ChatMessage) => {
    // Jika game sedang proses animasi ATAU antrian sudah ada isinya
    if (processingRef.current || moveQueueRef.current.length > 0) {
      // Masukkan ke antrian
      moveQueueRef.current.push({ firstId, secondId, player });
    } else {
      // Game idle, eksekusi langsung
      executeMove(firstId, secondId, player);
    }
  }, [executeMove]);

  // Handle Socket Events
  useEffect(() => {
    const handleConnected = (state: any) => {
      setConnection({
        isConnected: true,
        roomId: state.roomId,
        error: null
      });
      
      const hasActiveGame = cardsRef.current.length > 0 && statusRef.current !== GameStatus.GAME_OVER;
      
      if (hasActiveGame) {
        setStatus(GameStatus.PLAYING);
        setLastEvent('Connected! Resuming game...');
      } else {
        setStatus(GameStatus.PLAYING);
        startGame();
      }
      
      setActiveTab('game');
    };

    const handleDisconnected = (msg: string) => {
      setConnection(prev => ({ ...prev, isConnected: false, error: msg }));
      
      if (cardsRef.current.length > 0 && statusRef.current !== GameStatus.GAME_OVER) {
         setLastEvent('Disconnected. Waiting for reconnect...');
      } else {
         setStatus(GameStatus.IDLE);
      }
    };

    const handleChat = (msg: ChatMessage) => {
      if (statusRef.current !== GameStatus.PLAYING) return;
      
      const comment = msg.comment.trim();
      const match = comment.match(/(\d+)\s+[^\d]*(\d+)/) || comment.match(/(\d+)[^\d]+(\d+)/);
      
      if (match) {
        const first = parseInt(match[1]);
        const second = parseInt(match[2]);
        // Call the Queued Handler instead of direct execute
        handleMoveRequest(first, second, msg);
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
  }, [startGame, handleMoveRequest]); 

  const connectToTikTok = () => {
    const isIndofinity = socketService.isIndofinity();
    if (!username && !isIndofinity) return;
    
    setStatus(GameStatus.CONNECTING);
    socketService.connect(username);
  };

  const disconnectTikTok = () => {
    socketService.disconnect();
  };

  return (
    // Apply theme class here based on state
    <div className={`theme-${currentTheme} h-screen bg-background text-text-main font-sans overflow-hidden flex flex-col transition-colors duration-300`}>
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'game' && (
          <GameBoard 
            cards={cards} 
            connection={connection} 
            lastEvent={lastEvent} 
            startGame={startGame}
            scores={sessionScores} 
            status={status}
            globalScores={leaderboard}
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
            currentTheme={currentTheme}
            setTheme={setCurrentTheme}
          />
        )}
        
        {activeTab === 'leaderboard' && (
          <LeaderboardPanel 
            sessionScores={sessionScores} 
            globalScores={leaderboard} 
          /> 
        )}
      </div>

      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
    </div>
  );
};

export default App;