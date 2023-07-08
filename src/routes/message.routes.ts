import { Router } from "express";
import { postImageMessageForRequest,postContentMessageForRequest,postImageMessageForAdvice,postContentMessageForAdvice } from "../controllers/message.controller";

import upload from '../config/image.config'

const router = Router();

import  {requireAuth} from "../middleware/AuthMiddleware";
import { areyouThePlantSittingOwnerOrTheBooker,isThisRequestTaken } from "../middleware/RequestMiddleware";
import { areYouTheAdviceOwnerOrTheAdvicer,isThisAdviceTaken} from "../middleware/adviceMiddleware";


router.post("/plantSitting/image/:requestId",  requireAuth,isThisRequestTaken,areyouThePlantSittingOwnerOrTheBooker,upload.single("file"), postImageMessageForRequest);
router.post("/plantSitting/:requestId",  requireAuth,isThisRequestTaken,areyouThePlantSittingOwnerOrTheBooker, postContentMessageForRequest);
router.post("/advice/image/:adviceId",  requireAuth,isThisAdviceTaken,areYouTheAdviceOwnerOrTheAdvicer,upload.single("file"), postImageMessageForAdvice);
router.post("/advice/:adviceId",  requireAuth,isThisAdviceTaken,areYouTheAdviceOwnerOrTheAdvicer, postContentMessageForAdvice);

export default router;
