import { Router } from "express";
import { postImageMessage,postContentMessage } from "../controllers/message.controller";
import upload from '../config/image.config'

const router = Router();

import  {requireAuth} from "../middleware/AuthMiddleware";
import { areyouThePlantSittingOwnerOrTheBooker } from "../middleware/RequestMiddleware";


router.post("/plantSitting/image/:requestId",  requireAuth,areyouThePlantSittingOwnerOrTheBooker,upload.single("file"), postImageMessage);
router.post("/plantSitting/:requestId",  requireAuth,areyouThePlantSittingOwnerOrTheBooker, postContentMessage);

export default router;
