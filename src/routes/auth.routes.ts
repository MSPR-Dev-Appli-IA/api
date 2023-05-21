import { Router } from "express";
import  {requireAuth,notRequireAuth} from "../middleware/AuthMiddleware";
import {login, logout, me, register} from "../controllers/auth.controller";

const router = Router();

router.post("/login", notRequireAuth, login);
router.get("/logout", requireAuth, logout);
router.get("/me", requireAuth, me);
router.post("/register",notRequireAuth, register);

export default router;
