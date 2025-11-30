import { io, Socket } from 'socket.io-client';

type Listener = (...args: any[]) => void;

class TikTokSocketService {
  private socket: Socket | null = null;
  private backendUrl: string;
  private listeners: Map<string, Listener[]> = new Map();

  constructor() {
    // Default to localhost based on the user's provided server.js code, 
    // but can be changed if running on a real Android device connected to a PC IP.
    this.backendUrl = 'https://buat-lev.up.railway.app'; 
  }

  public setBackendUrl(url: string) {
    this.backendUrl = url;
  }

  public connect(uniqueId: string) {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(this.backendUrl);

    this.socket.on('connect', () => {
      console.log('Socket connected to backend');
      // Request TikTok connection via backend
      this.socket?.emit('setUniqueId', uniqueId, {
        enableExtendedGiftInfo: false
      });
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
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
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