import express from "express";
import { verifyToken } from "../controllers/jwt/jwtAuth";
import * as UserController from '../controllers/users';

const router = express.Router();

router.get('/',verifyToken,UserController.getAuthenticatedUser);
router.post('/signup', UserController.signUp);
router.post('/login', UserController.login);
router.post('/logout',UserController.logout);

export default router;