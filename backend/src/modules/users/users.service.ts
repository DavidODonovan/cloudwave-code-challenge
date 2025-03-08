
import { eq } from "drizzle-orm";
import { usersTable } from "../../db/schema";
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { User } from "../../db/schema";

export class UsersService {
    constructor(private db: NodePgDatabase) {
        this.db = db;
    };

    createUser = async (payload) => {
        // return this.db.insert(usersTable, user);
        try {
            console.log('create user here is your service~~~~~~====>', payload);
            // const user = await this.db.insert(usersTable, { name });
            // // console.log('user created====>', user);
            return payload;
        } catch (error) {
            console.log('service error====>', error); 
            throw error;
        }
    };
}
