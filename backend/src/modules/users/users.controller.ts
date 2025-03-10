import { Router, Request, Response } from 'express';
import { UsersService } from './users.service';
import { createUserSchema } from './users.validator';
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
      // SETUP ROUTES with correct HTTP METHODS.
      // Use bind to create a properly typed handler - typescript will complain if you don't...
      this.router.post('/', this.createUser.bind(this));
      this.router.get('/', this.getAllUsers.bind(this));
      this.router.get('/:id', this.getUserById.bind(this));
    };
  
    // don't use arrow functions here, as we need to bind the context using .bind(this) as above to avoid TypeScript errors...
    private async createUser(req: Request, res: Response): Promise<Response> {
        try {
            createUserSchema.parse(req.body); // validate incoming request body, will throw an error if invalid.
            const user = await this.usersService.createUser(req.body); // forward payload to service for insertion into database.
            return res.status(201).json(user); // return the created user in the response.
        } catch (error) {
            // catch all errors from validation, service, etc. and return a 500 error with a message.
            return res.status(500).json({ 
                message: error instanceof Error ? error.message : 'Unknown error' 
            });
        };
    };

    private async getAllUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users = await this.usersService.getAllUsers();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ 
                message: error instanceof Error ? error.message : 'Unknown error' 
            });
        };
    };

    private async getUserById(req: Request, res: Response): Promise<Response> {
        try {
            const user = await this.usersService.getUserById(parseInt(req.params.id));
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ 
                message: error instanceof Error ? error.message : 'Unknown error' 
            });
        };
    };

}