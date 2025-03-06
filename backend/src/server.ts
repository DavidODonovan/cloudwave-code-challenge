import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import { drizzle } from 'drizzle-orm/node-postgres';
import CONFIG from '../config';
import { eq } from 'drizzle-orm';
import { usersTable } from './db/schema';

const app = express();
const router = express.Router();
const httpServer = http.createServer(http);
const io = new IOServer(httpServer);
const db = drizzle(process.env.DATABASE_URL!);

console.log({db})

async function main() {
  const user: typeof usersTable.$inferInsert = {
    name: 'John',
    age: 30,
    email: 'john@example.com',
  };
  await db.insert(usersTable).values(user);
  console.log('New user created!')
  const users = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', users)
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */
  await db
    .update(usersTable)
    .set({
      age: 31,
    })
    .where(eq(usersTable.email, user.email));
  console.log('User info updated!')
  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log('User deleted!')
}
main();

app.use(router);
app.use(cors({ origin: '*' }));

io.on('connection', (socket) => {
  console.log("a user connected");
});
// io.emit('disconnect'); 

console.log("process.env.DATABASE_URL", process.env.DATABASE_URL);

httpServer.listen(CONFIG.PORT, () => {
  console.log(`Server listening on *:${CONFIG.PORT} 🚀`);
});
