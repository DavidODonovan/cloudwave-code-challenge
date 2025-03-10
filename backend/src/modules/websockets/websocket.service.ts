
import { Server as IOServer, Socket } from 'socket.io';
import { CONNECTION, MESSAGE, REGISTER, DISCONNECT, USER_LIST } from '../../constants';
export class WebSocketService {

    private userSocketMap = {};
    private socketUserMap = {};
    

    constructor(
      private io: IOServer,
    ) {
        this.initialize();
    }

    initialize(): void {
        this.io.on(CONNECTION, this.handleConnection.bind(this));
    }

    handleConnection(socket: Socket): void {
        const socketId = socket.id;
        socket.on(MESSAGE, (data)=>this.handleMessage(data));
        socket.on(REGISTER, (data)=>this.handleRegister(data, socket));
        socket.on(DISCONNECT, (reason)=>this.handleDisconnect(reason, socketId, socket ));
    };

    // handleRegister({ user_id, socket_id }: { user_id: string, socket_id: string }): void {
    handleRegister(data, socket): void {
        const { user_id, socket_id } = data;
        const userKey = user_id.toString();
        console.log('registering user:', user_id, 'with socket:', socket_id);
        this.userSocketMap[userKey] ? this.userSocketMap[userKey].push(socket_id) : this.userSocketMap[userKey] = [socket_id];
        this.socketUserMap[socket_id] ? this.socketUserMap[socket_id].push(user_id) : this.socketUserMap[socket_id] = [user_id];
        console.log('sockets register:', this.userSocketMap);
        // emit event to all clients/users with updated userlist
        // socket.emit('userlist', Array.from(this.userSocketMap.keys()));
    };

    handleMessage(message: any): void {
        console.log('handleMessage: message received', message);
        console.log('handleMessage: sockets:', this.userSocketMap);
        // TODO emit message event to recipient using message.receiver_id and save message to database messages table with both ids.
        const receiverUserId = message.receiver_user_id;
        const receiverSocketIdArray = this.userSocketMap[receiverUserId];
        console.log({receiverSocketIdArray});
        if (receiverSocketIdArray) {
            receiverSocketIdArray.forEach(receiverSocketId => {
                console.log('sending message to:', receiverSocketId);
            this.io.to(receiverSocketId).emit('message', message);
            });
        };
    };

    handleDisconnect(reason, socketId, socket): void {
        //TODO remove user_id from userSocketMap
        console.log('socket disconnected:', socketId, 'reason:', reason);
        if(socketId){
        //   this.userSocketMap.delete(socketId);
        // emit event to all clients/users with updated userlist
        // socket.emit(USER_LIST, Array.from(this.userSocketMap.keys()));
        console.log('socket should have emitted:');
        }
    }

};