
import { eq } from "drizzle-orm";
import { usersTable } from "../db/schema";
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { User } from "../db/schema";

class UserController {
    constructor(private db: NodePgDatabase) {
        this.db = db;
    };

    createUser = async (req, res) => {
        // return this.db.insert(usersTable, user);
        try {
            const { name } = req.body;
            console.log('create user here====>', req.body);
            // const user = await this.db.insert(usersTable, { name });
            // // console.log('user created====>', user);
            res.send(req.body.name);
        } catch (error) {
            console.log('error====>', error); 
            res.status(400).send(error);
        }
    };
}

export default UserController;