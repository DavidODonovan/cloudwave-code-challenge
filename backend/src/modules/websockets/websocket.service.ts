
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
        const socketId = socket.id;
        socket.on('message', (data)=>this.handleMessage(data));
        socket.on('register', (data)=>this.handleRegister(data));
        socket.on('disconnect', (reason)=>this.handleDisconnect(reason, socketId ));
    };

    handleRegister({ user_id, socket_id }: { user_id: string, socket_id: string }): void {
        console.log('registering user:', user_id, 'with socket:', socket_id);
        this.socketsMap.set(user_id, socket_id);
        console.log('sockets register:', this.socketsMap);
    };

    handleMessage(message: any): void {
        console.log('websocket message received', message);
        // TODO emit message event to recipient using message.receiver_id and save message to database messages table with both ids.
        const receiverSocketId = this.socketsMap.get(message.receiver_user_id);
        console.log({receiverSocketId});
        console.log('sockets:', this.socketsMap);
        if (receiverSocketId) {
            this.io.to(receiverSocketId).emit('message', message);
        };
    };

    handleDisconnect(reason, socketId): void {
        //TODO remove user_id from socketsMap
        console.log('socket disconnected:', socketId, 'reason:', reason);
        if(socketId){
          this.socketsMap.delete(socketId);
        }
    }

};