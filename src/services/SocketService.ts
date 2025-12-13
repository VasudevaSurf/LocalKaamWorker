import { io, Socket } from 'socket.io-client/dist/socket.io';

// Replace with your actual server URL
const SERVER_URL = 'https://localkaamserver-lpvt.onrender.com';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SERVER_URL, {
        transports: ['websocket'],
        forceNew: true,
      });

      this.socket.on('connect', () => {
        console.log('[Socket] Connected to server:', this.socket?.id);
      });

      this.socket.on('connect_error', err => {
        console.error('[Socket] Connection error:', err);
      });

      this.socket.on('disconnect', () => {
        console.log('[Socket] Disconnected');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Join global worker room and personal worker room
  joinWorkerRoom(workerId: string) {
    if (this.socket) {
      this.socket.emit('join_worker_room', workerId);
      console.log('[Socket] Joining worker room:', workerId);
    }
  }

  // Listen for new service requests (Global)
  onNewRequest(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('new_request', callback);
    }
  }

  // Listen for quote acceptance (Personal)
  onRequestAccepted(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('request_accepted', callback);
    }
  }

  offNewRequest() {
    if (this.socket) {
      this.socket.off('new_request');
    }
  }

  offRequestAccepted() {
    if (this.socket) {
      this.socket.off('request_accepted');
    }
  }
}

export default new SocketService();
