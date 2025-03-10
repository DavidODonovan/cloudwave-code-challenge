
import { Server as IOServer, Socket } from 'socket.io';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export class WebSocketService {
    constructor(
      private io: IOServer,
      private db: NodePgDatabase
    ) {
        this.initialize();
    }

    initialize(): void {
        this.io.on('connection', this.handleConnection.bind(this));
    }

    handleConnection(socket: Socket): void {
        socket.on('message', this.handleMessage.bind(this));
        socket.on('register', this.handleRegister.bind(this));
    }

    handleMessage(message: any): void {
        console.log('message received', message);
        this.io.emit('message', message);
        console.log('message sent to all clients');
        // emit message event to recipient and save message to database messages table.
    }

    handleRegister({ user_id, socket_id }: { user_id: string, socket_id: string }): void {
        console.log('new register event:', user_id, socket_id);
    }
};