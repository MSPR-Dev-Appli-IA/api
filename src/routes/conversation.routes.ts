import { Router } from "express";
import {acceptConversation,refuseConversation,newConversation,removeConversation,getOneConversation} from "../controllers/conversation.controller"

const router = Router();

import  {requireAuth} from "../middleware/AuthMiddleware";
import { areThePlantSittingStillAvailable, areThePlantSittingStillAvailableFromTheConversation, areyouThePlantSittingOwner, areyouThePlantSittingOwnerFromTheConversation } from "../middleware/PlantSittingMiddleware";
import { areyouTheConversationOwner, areyouThePlantSittingOwnerOrTheBooker } from "../middleware/ConversationMiddleware";

router.get("/:conversationId",  requireAuth,areyouThePlantSittingOwnerOrTheBooker, getOneConversation);
router.post("/accept/:conversationId",  requireAuth,areyouThePlantSittingOwnerFromTheConversation,areThePlantSittingStillAvailableFromTheConversation ,acceptConversation);
router.post("/refuse/:conversationId",  requireAuth,areyouThePlantSittingOwnerFromTheConversation,areThePlantSittingStillAvailableFromTheConversation, refuseConversation);
router.post("/:plantSittingId",  requireAuth,areyouThePlantSittingOwner,areThePlantSittingStillAvailable, newConversation);
router.delete("/:conversationId",  requireAuth,areyouTheConversationOwner, removeConversation);
export default router;
