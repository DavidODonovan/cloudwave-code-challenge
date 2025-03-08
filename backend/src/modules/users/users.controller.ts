import { Router, Request, Response } from 'express';
import { UsersService } from './users.service';
import { validateUser } from './users.validator';
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
          const result = validateUser(req.body);
          if (!result.success) {
              return res.status(400).json({ errors: result.error.format() });
          }
          
          const user = await this.usersService.createUser(result.data);
          return res.status(201).json(user);
      } catch (error) {
          return res.status(500).json({ 
              message: error instanceof Error ? error.message : 'Unknown error' 
          });
      }
  }
}