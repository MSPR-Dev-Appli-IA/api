import { Router } from "express";
import {getSpecies,getOneSpecies,newSpecies,updateSpecies,removeImageFromSpecies,addImagesFromSpecies,removeSpecies} from "../controllers/species.controller"
import upload from '../config/image.config'

const router = Router();

import  {requireAuth,isItBotanist} from "../middleware/AuthMiddleware";

router.get("/",  requireAuth, getSpecies);
router.get("/:speciesId",  requireAuth, getOneSpecies);
router.post("/",  requireAuth,isItBotanist, newSpecies);
router.post("/:speciesId",requireAuth,isItBotanist,  requireAuth,upload.array("files"), updateSpecies);
router.post("/addImages/:speciesId",requireAuth,isItBotanist,upload.array("files"),addImagesFromSpecies)
router.delete("/deleteImage/:speciedId/:imageId",  requireAuth,isItBotanist, removeImageFromSpecies);
router.delete("/:speciedId",  requireAuth,isItBotanist, removeSpecies);
export default router;
