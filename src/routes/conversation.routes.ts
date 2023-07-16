import {Router} from "express";
import {requireAuth} from "../middleware/AuthMiddleware";
import {getAllUserConversation} from "../controllers/conversation.controller";


const router = Router();

router.get('/', requireAuth, getAllUserConversation)

export default router;