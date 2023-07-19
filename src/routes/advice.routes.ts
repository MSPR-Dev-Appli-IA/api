import { Router } from "express";

import  {areYouThePlantOwner} from "../middleware/PlantMiddleware";
import {getAdvicesNotTaken,getMyAdvicesBotanist,getOneAdvice,createAdvice,takeOneAdvice,removeAdvice,getMyAdvicesForOnePlant,addImageFromAdvice,removeImageFromAdvice, updateAdvice} from "../controllers/advice.controller"
const router = Router();

import  {isItBotanist, requireAuth} from "../middleware/AuthMiddleware";
import { AreYouBotanistOrOwnerAdvice, areYouTheAdviceOwner ,notAlreadyTaken} from "../middleware/adviceMiddleware";
import upload from '../config/image.config'

router.get('/',requireAuth,isItBotanist,getAdvicesNotTaken)
router.get('/me/:plantId',requireAuth,getMyAdvicesForOnePlant)
router.get('/botanist',requireAuth,isItBotanist,getMyAdvicesBotanist)
router.get("/:adviceId",requireAuth,AreYouBotanistOrOwnerAdvice,getOneAdvice)
router.post("/:plantId",requireAuth,areYouThePlantOwner,createAdvice)
router.post("/update/:adviceId",requireAuth,areYouThePlantOwner,updateAdvice)
router.post('/take/:adviceId',requireAuth,isItBotanist,notAlreadyTaken,takeOneAdvice)
router.post("/addImage/:adviceId",requireAuth,areYouTheAdviceOwner,upload.single("file"),addImageFromAdvice)
router.delete("/deleteImage/:adviceId/:imageId",  requireAuth,areYouTheAdviceOwner, removeImageFromAdvice);
router.delete('/:adviceId',requireAuth,areYouTheAdviceOwner,removeAdvice)


export default router;
