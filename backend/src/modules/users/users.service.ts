
import { usersTable, NewUser } from "../../db/schema";
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export class UsersService {
    constructor(private db: NodePgDatabase) {
        this.db = db;
    };

    createUser = async (payload): Promise<NewUser> => {
        const user: typeof usersTable.$inferInsert = {
            name: payload.name,
          };
        try {
            const newUserArray = await this.db.insert(usersTable).values(user).returning();
            return newUserArray[0];
        } catch (error) {
            throw error;
        }
    };
}
