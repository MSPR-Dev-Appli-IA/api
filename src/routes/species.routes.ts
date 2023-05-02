import { Router } from "express";
import {getSpecies,getOneSpecies,newSpecies,updateSpecies,removeImageFromSpecies,addImageFromSpecies,removeSpecies} from "../controllers/species.controller"
import upload from '../config/image.config'

const router = Router();

import  {requireAuth,isItBotanist} from "../middleware/AuthMiddleware";

router.get("/",  requireAuth, getSpecies);
router.get("/:speciesId",  requireAuth, getOneSpecies);
router.post("/",  requireAuth,isItBotanist, newSpecies);
router.post("/:speciesId",requireAuth,isItBotanist, updateSpecies);
router.post("/addImage/:speciesId",requireAuth,isItBotanist,upload.single("file"),addImageFromSpecies)
router.delete("/deleteImage/:speciedId/:imageId",  requireAuth,isItBotanist, removeImageFromSpecies);
router.delete("/:speciedId",  requireAuth,isItBotanist, removeSpecies);
export default router;
