
import { Server as IOServer, Socket } from 'socket.io';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export class WebSocketService {

    private socketsMap = new Map<string, string>();

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

    handleRegister({ user_id, socket_id }: { user_id: string, socket_id: string }): void {
        console.log('new register event:', user_id, socket_id);

        //TODO map user_id to socket_id object
        this.socketsMap.set(user_id, socket_id);
        console.log('sockets:', this.socketsMap);
    }

    handleMessage(message: any): void {
        console.log('message received', message);
        console.log('message sent to all clients');
        // TODO emit message event to recipient using message.receiver_id and save message to database messages table with both ids.
        // this.io.to(message.receiver_id).emit('message', message);
    }

};