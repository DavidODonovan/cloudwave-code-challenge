
import { Server as IOServer, Socket } from 'socket.io';
import { CONNECTION, MESSAGE, REGISTER, DISCONNECT, USER_LIST_UPDATE } from '../../constants';
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
        socket.on(REGISTER, (data)=>this.handleRegister(data));
        socket.on(DISCONNECT, (reason)=>this.handleDisconnect(reason, socketId));
    };

    // handleRegister({ user_id, socket_id }: { user_id: string, socket_id: string }): void {
    handleRegister(data): void {
        const { user_id, socket_id } = data;
        const userKey = user_id.toString();
        console.log('registering user:', user_id, 'with socket:', socket_id);
        this.userSocketMap[userKey] ? this.userSocketMap[userKey].push(socket_id) : this.userSocketMap[userKey] = [socket_id];
        this.socketUserMap[socket_id] ? this.socketUserMap[socket_id].push(user_id) : this.socketUserMap[socket_id] = [user_id];
        console.log('userSocketMap register:', this.userSocketMap);
        // emit event to all clients/users with updated userlist
        // socket.emit('userlist', Array.from(this.userSocketMap.keys()));
        this.io.emit(USER_LIST_UPDATE, Object.keys(this.userSocketMap));
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
            this.io.to(receiverSocketId).emit(MESSAGE, message);
            });
        };
    };

    handleDisconnect(reason, socketId): void {
        //TODO remove user_id from userSocketMap
        console.log('userSocketMap before disconnect:', this.userSocketMap);
        console.log('socketUserMap before disconnect:', this.socketUserMap);
        if(socketId){
            const userArray = this.socketUserMap[socketId];
            if(userArray){
                userArray.forEach(user_id => {
                    const socketArray = this.userSocketMap[user_id];
                    if(socketArray){
                        const index = socketArray.indexOf(socketId);
                        if(index > -1){
                            socketArray.splice(index, 1);
                        }
                    }
                });
            }
            delete this.socketUserMap[socketId];
        }
        console.log('userSocketMap after disconnect:', this.userSocketMap);
        console.log('socketUserMap after disconnect:', this.socketUserMap);

        // emit event to all clients/users with updated userlist
        this.io.emit(USER_LIST_UPDATE, Object.keys(this.userSocketMap));
    }

};