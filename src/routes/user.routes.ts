
import { Router } from "express";
import {updateUser,updateUserPassword,updateUserAvatar,deleteUserAvatar} from "../controllers/user.controller"
import upload from '../config/image.config'


const router = Router();

import  {requireAuth,} from "../middleware/AuthMiddleware";

router.post("/update", requireAuth, updateUser);
router.post("/updatePassword", requireAuth, updateUserPassword);
router.post("/updateAvatar", requireAuth,upload.single("file"), updateUserAvatar)
router.delete("/deleteAvatar", requireAuth, deleteUserAvatar)
export default router;


