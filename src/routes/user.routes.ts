
import { Router } from "express";
import {updateUser,updateUserAvatar,deleteUserAvatar} from "../controllers/user.controller"
import upload from '../config/image.config'


const router = Router();

import  {requireAuth,} from "../middleware/AuthMiddleware";

router.post("/", requireAuth, updateUser);
router.post("/avatar", requireAuth, upload.single("file"), updateUserAvatar)
router.delete("/avatar", requireAuth, deleteUserAvatar)
export default router;


