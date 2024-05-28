import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import { errorHandler } from "../error-handler";
import { addAddress, deleteAddress, listAddress } from "../controllers/user";

const userRoutes: Router = Router();

userRoutes.post('/address', [authMiddleware, adminMiddleware], errorHandler(addAddress));
userRoutes.delete('/address/:id', [authMiddleware, adminMiddleware], errorHandler(deleteAddress));
userRoutes.get('/address', [authMiddleware, adminMiddleware], errorHandler(listAddress));

export default userRoutes;