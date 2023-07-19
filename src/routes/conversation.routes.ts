import {Router} from "express";
import {requireAuth} from "../middleware/AuthMiddleware";
import {ConversationController} from "../controllers/conversation.controller";
import {areyouThePlantSittingOwnerOrTheBooker, isThisRequestTaken} from "../middleware/RequestMiddleware";
import {ConversationMiddleware} from "../middleware/ConversationMiddleware";


const router = Router();

const conversationController  = new ConversationController()
const conversationMiddleware = new ConversationMiddleware()

router.get('/', requireAuth, conversationController.index)
router.post('/', requireAuth, isThisRequestTaken, areyouThePlantSittingOwnerOrTheBooker, conversationMiddleware.talkTo, conversationController.store)

router.get('/:userId', requireAuth, conversationMiddleware.talkTo, conversationController.show)

export default router;