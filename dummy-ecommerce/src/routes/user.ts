import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import { addAddress, deleteAddress, listAddress } from "../controllers/user";

const userRoutes: Router = Router();

userRoutes.post('/address', [authMiddleware], errorHandler(addAddress));
userRoutes.delete('/address/:id', [authMiddleware], errorHandler(deleteAddress));
userRoutes.get('/address', [authMiddleware], errorHandler(listAddress));

export default userRoutes;