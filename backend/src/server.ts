import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import { drizzle } from 'drizzle-orm/node-postgres';
import CONFIG from '../config';
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { Pool } from 'pg';

import { UsersController } from './modules/users/users.controller';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
const httpServer = http.createServer(app);
const io = new IOServer(httpServer);
const db = drizzle(pool);

// middleware
app.use(cors({ origin: '*' }));
app.use(express.json()); 


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/users/',new UsersController(db).router);


// drizzle setup
async function initialiseDatabase() {
  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Database initialisation complete. Migrations completed successfully.')
  } catch (error) {
    console.log('Database initialisation failed', error);
    process.exit(1);
  }
}

io.on('connection', (socket) => {
  console.log("a user connected");
});

httpServer.listen(CONFIG.PORT, async () => {
  console.log(`Server listening on *:${CONFIG.PORT} 🚀`);
  await initialiseDatabase();
});
