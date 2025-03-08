import { Router, Request, Response } from "express";
import { UsersService }  from "./users.service";
import { NodePgDatabase } from 'drizzle-orm/node-postgres';


export class UsersController { 
    public router: Router;
    private usersService: UsersService;

    constructor(db: NodePgDatabase) {
        this.router = Router();
        this.usersService = new UsersService(db);
        this.initializeRoutes();
    };

    private initializeRoutes(): void {
        this.router.post('/', (req, res)=>this.usersService.createUser(req, res));
    };

}

