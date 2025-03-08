import { Router } from "express";
import UserController from "../controllers/UserController";

const createUserRoutes = (userController): Router => {
    const router = Router();

    router.post('/', (req, res)=>{
       return userController.createUser(req, res);
    });
    
    return router;
};

export default createUserRoutes;