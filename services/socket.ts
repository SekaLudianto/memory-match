import { io, Socket } from 'socket.io-client';

type Listener = (...args: any[]) => void;

class TikTokSocketService {
  private socket: Socket | null = null; // For Socket.IO (Public Server)
  private ws: WebSocket | null = null;  // For Native WebSocket (Indofinity)
  
  private backendUrl: string;
  private listeners: Map<string, Listener[]> = new Map();

  constructor() {
    this.backendUrl = 'https://buat-lev.up.railway.app'; 
  }

  public setBackendUrl(url: string) {
    this.backendUrl = url;
  }

  public getBackendUrl() {
    return this.backendUrl;
  }

  public isIndofinity() {
    return this.backendUrl.startsWith('ws://') || this.backendUrl.includes('62024');
  }

  public connect(uniqueId?: string) {
    this.disconnect();

    if (this.isIndofinity()) {
      this.connectWebSocket();
    } else {
      this.connectSocketIO(uniqueId || '');
    }
  }

  // --- MODE 1: INDOFINITY (WebSocket) ---
  private connectWebSocket() {
    console.log('Connecting to Indofinity WebSocket:', this.backendUrl);
    
    try {
      this.ws = new WebSocket(this.backendUrl);

      this.ws.onopen = () => {
        console.log('Indofinity WebSocket Open');
        // Indofinity is "Always Connected" to the tool, so we simulate a connection event immediately
        // The roomId is generic since we don't get it from the handshake
        this.emit('connected', { roomId: 'INDOFINITY-LOCAL', isConnected: true });
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const { event: eventName, data } = message;

          // Map Indofinity events to App events
          if (eventName === 'chat') {
            this.emit('chat', data);
          } else if (eventName === 'gift') {
             // Optional: Handle gifts if needed later
             // this.emit('gift', data);
          } else if (eventName === 'disconnect') {
             this.emit('disconnected', 'Indofinity Disconnected');
          }
          
          // Indofinity might send other events, ignore for now

        } catch (error) {
          console.error('Error parsing Indofinity message:', error);
        }
      };

      this.ws.onerror = (err) => {
        console.error('Indofinity Error:', err);
        this.emit('disconnected', 'WebSocket Connection Failed');
      };

      this.ws.onclose = () => {
        console.log('Indofinity WebSocket Closed');
        this.emit('disconnected', 'Connection Closed');
      };

    } catch (e) {
      this.emit('disconnected', 'Invalid WebSocket URL');
    }
  }

  // --- MODE 2: PUBLIC SERVER (Socket.IO) ---
  private connectSocketIO(uniqueId: string) {
    console.log('Connecting to Public Socket.IO:', this.backendUrl);

    this.socket = io(this.backendUrl, {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Socket connected to backend');
      if (uniqueId) {
        this.socket?.emit('setUniqueId', uniqueId, {
          enableExtendedGiftInfo: false
        });
      } else {
        this.emit('disconnected', 'Username required for Public Server');
      }
    });

    this.socket.on('tiktokConnected', (state: any) => {
      this.emit('connected', state);
    });

    this.socket.on('tiktokDisconnected', (errMsg: string) => {
      this.emit('disconnected', errMsg);
    });

    this.socket.on('chat', (msg: any) => {
      this.emit('chat', msg);
    });

    this.socket.on('streamEnd', () => {
      this.emit('streamEnd');
    });

    this.socket.on('disconnect', () => {
      this.emit('disconnected', 'Socket Disconnected');
    });
  }

  public disconnect() {
    // Cleanup Socket.IO
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    // Cleanup WebSocket
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public on(event: string, fn: Listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(fn);
    return this;
  }

  public off(event: string, fn: Listener) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      this.listeners.set(event, handlers.filter(l => l !== fn));
    }
    return this;
  }

  public emit(event: string, ...args: any[]) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach(fn => fn(...args));
    }
  }
}

export const socketService = new TikTokSocketService();