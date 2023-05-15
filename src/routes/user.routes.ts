
import { Router } from "express";
import {updateUser,updateUserPassword,updateUserAvatar} from "../controllers/user.controller"


const router = Router();

import  {requireAuth,} from "../middleware/AuthMiddleware";

router.post("/update", requireAuth, updateUser);
router.post("/updatePassword", requireAuth, updateUserPassword);
router.post("/updateAvatar", requireAuth, updateUserAvatar)
export default router;


