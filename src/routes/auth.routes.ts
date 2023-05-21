import { Router } from "express";
import  {requireAuth,notRequireAuth} from "../middleware/AuthMiddleware";
import {createDefaultAccountWithBotanistRight, login, logout, me, register} from "../controllers/auth.controller";

const router = Router();

router.post("/login", notRequireAuth, login);
router.get("/logout", requireAuth, logout);
router.get("/me", requireAuth, me);
router.post("/register",notRequireAuth, register);
router.post("/createDefaultBotanist", requireAuth, createDefaultAccountWithBotanistRight)

export default router;
