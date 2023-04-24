import { Router } from "express";
import {getSpecies,getOneSpecies,newSpecies,updateSpecies,removeImageFromSpecies,addImagesFromSpecies,removeSpecies} from "../controllers/species.controller"
import upload from '../config/image.config'

const router = Router();

import  {requireAuth} from "../middleware/AuthMiddleware";

router.get("/",  requireAuth, getSpecies);
router.get("/:speciesId",  requireAuth, getOneSpecies);
router.post("/",  requireAuth,upload.array("files"), newSpecies);
router.post("/:speciesId",  requireAuth,upload.array("files"), updateSpecies);
router.post("/addImages/:speciesId",upload.array("files"),addImagesFromSpecies)
router.delete("/deleteImage/:speciedId/:imageId",  requireAuth, removeImageFromSpecies);
router.delete("/:speciedId",  requireAuth, removeSpecies);
export default router;
