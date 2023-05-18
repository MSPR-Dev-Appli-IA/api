import { Router } from "express";
import { login, signout, me, register }  from "../controllers/auth.controller";

const router = Router();

import  {requireAuth,notRequireAuth} from "../middleware/AuthMiddleware";

router.post("/login", notRequireAuth, login);
router.get("/logout", requireAuth, signout);
router.get("/me", me);
router.post("/register",notRequireAuth, register);

export default router;
