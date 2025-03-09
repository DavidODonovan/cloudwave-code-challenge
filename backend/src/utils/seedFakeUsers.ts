import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { usersTable } from '../db/schema';

export const seedFakeUsers = async (db: NodePgDatabase) => {
    const userNames = ['Lena13', 'Libby11', 'Lucky1', 'Janina1', 'Melissa32', 'PeteTheGreat', 'SallySellsSeaShells', 'SuziQ', 'Bretto', 'Lester'];
    try {
      await Promise.all(userNames.map(async (name) => {
        await db.insert(usersTable).values({ name });
      })); 
    } catch (error) {
        console.log('Error seeding fake users', error);
    }
};