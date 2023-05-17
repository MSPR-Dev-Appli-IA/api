import { Router } from "express";

import  {areyouThePlantOwner} from "../middleware/PlantMiddleware";
import {getAdvicesNotTaken,getMyAdvices,getMyAdvicesBotanist,getOneAdvice,createAdvice,takeOneAdvice,removeAdvice} from "../controllers/advice.controller"
const router = Router();

import  {isItBotanist, requireAuth} from "../middleware/AuthMiddleware";
import { AreYouBotanistOrOwnerAdvice, areYouTheAdviceOwner } from "../middleware/adviceMiddleware";




router.get('/',requireAuth,isItBotanist,getAdvicesNotTaken)
router.get('/me',requireAuth,getMyAdvices)
router.get('/botanist',requireAuth,isItBotanist,getMyAdvicesBotanist)
router.get("/:adviceId",requireAuth,AreYouBotanistOrOwnerAdvice,getOneAdvice)
router.post("/plantId",requireAuth,areyouThePlantOwner,createAdvice)
router.post('/take/:adviceId',requireAuth,isItBotanist,takeOneAdvice)
router.delete('/:adviceId',requireAuth,areYouTheAdviceOwner,removeAdvice)


export default router;
