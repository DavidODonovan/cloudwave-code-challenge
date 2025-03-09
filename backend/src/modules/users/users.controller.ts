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
    }
    
    private initializeRoutes(): void {
      // Use bind to create a properly typed handler - typescript will complain if you don't...
      this.router.post('/', this.createUser.bind(this));
  }
  
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
      }
  }
}