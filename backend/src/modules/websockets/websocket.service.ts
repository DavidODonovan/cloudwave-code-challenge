
import { Server as IOServer, Socket } from 'socket.io';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

class WebSocketService {
    constructor(
      private io: IOServer,
      private db: NodePgDatabase
    ) {
    }
}