import { usersTable, NewUser, User } from "../../db/schema";
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

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

    getAllUsers = async (): Promise<User[]> => {
        try {
            const users = await this.db.select().from(usersTable);
            return users;
        } catch (error) {
            throw error;
        }
    }

    getUserById = async (id: number): Promise<User> => {
        console.log("service id", id);
        try {
            const user = await this.db.select().from(usersTable).where(eq(usersTable.id, id));
            if(user.length === 0) {
                throw new Error("User not found");
            }
            return user[0];
        } catch (error) {
            throw error;
        }
    }
}
