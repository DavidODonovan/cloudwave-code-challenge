import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import { drizzle } from 'drizzle-orm/node-postgres';
import CONFIG from '../config';
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { Pool } from 'pg';
import { seedFakeUsers } from './utils/seedFakeUsers';

import { UsersController } from './modules/users/users.controller';

const app = express();
const httpServer = http.createServer(app);
const io = new IOServer(httpServer);

// drizzle setup - database connection and migrations, seed database with fake users.
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);
async function initialiseDatabase() {
  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Database initialisation complete. Migrations completed successfully.');
    await seedFakeUsers(db);
    console.log('Fake users seeded successfully.');
  } catch (error) {
    console.log('Database initialisation failed', error);
    process.exit(1);
  }
};

// middleware
app.use(cors({ origin: '*' }));
app.use(express.json()); 

// controllers
const usersController = new UsersController(db).router;
app.use('/api/users/', usersController);

// socket.io connection
io.on('connection', (socket) => {
   // Get all connected sockets
   const connectedSockets = io.sockets.sockets;
   const connectedSocketIds = Array.from(connectedSockets.keys());
   
   console.log("====================================");
   console.log("====================================");
   console.log("====================================");
   console.log('Connected sockets:', connectedSocketIds);
   console.log(`Total connections: ${connectedSocketIds.length}`);
   
   // You can also broadcast this information to all clients
   io.emit('user_count', connectedSocketIds.length);
  socket.on('message', (message) => {
    console.log('message received', message);
    io.emit('message', message);
    console.log('message sent to all clients');
  });
  socket.on('register', ({ user_id, socket_id }) => {
    console.log('new register event:', user_id, socket_id);
  })
});

// start server
httpServer.listen(CONFIG.PORT, async () => {
  console.log(`Server listening on *:${CONFIG.PORT} 🚀`);
  await initialiseDatabase();
});
