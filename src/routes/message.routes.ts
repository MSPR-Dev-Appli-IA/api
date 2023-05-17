import { Router } from "express";
import { postImageMessageForRequest,postContentMessageForRequest } from "../controllers/message.controller";
import upload from '../config/image.config'

const router = Router();

import  {requireAuth} from "../middleware/AuthMiddleware";
import { areyouThePlantSittingOwnerOrTheBooker } from "../middleware/RequestMiddleware";


router.post("/plantSitting/image/:requestId",  requireAuth,areyouThePlantSittingOwnerOrTheBooker,upload.single("file"), postImageMessageForRequest);
router.post("/plantSitting/:requestId",  requireAuth,areyouThePlantSittingOwnerOrTheBooker, postContentMessageForRequest);

export default router;
