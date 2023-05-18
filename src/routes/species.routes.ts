import { Router } from "express";
import {getSpecies,getOneSpecies,newSpecies,updateSpecies,removeImageFromSpecies,addImageFromSpecies,removeSpecies} from "../controllers/species.controller"
import upload from '../config/image.config'

const router = Router();

import  {requireAuth,isItBotanist} from "../middleware/AuthMiddleware";

router.get("/", requireAuth, getSpecies);
router.post("/", requireAuth,isItBotanist, newSpecies);
router.put("/", requireAuth,isItBotanist, updateSpecies);

router.get("/:speciesId",  requireAuth, getOneSpecies);
router.delete("/:speciedId",  requireAuth,isItBotanist, removeSpecies);

router.post("/addImage/",requireAuth,isItBotanist,upload.single("file"),addImageFromSpecies)

router.delete("/:speciedId/:imageId",  requireAuth,isItBotanist, removeImageFromSpecies);

export default router;
