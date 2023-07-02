import { Router } from "express";
import {getMyPlants,getOneOfMyPlant,newPlant,addImageFromPlant,removeImageFromPlant,removePlant,updatePlant} from "../controllers/plant.controller"
import upload from '../config/image.config'

const router = Router();

import  {requireAuth} from "../middleware/AuthMiddleware";

import  {areYouThePlantOwner} from "../middleware/PlantMiddleware";

router.get("/",  requireAuth, getMyPlants);
router.post("/",  requireAuth, newPlant);
router.put("/",  requireAuth, areYouThePlantOwner, updatePlant);

router.get("/:plantId",  requireAuth,areYouThePlantOwner, getOneOfMyPlant);
router.delete("/:plantId",  requireAuth,areYouThePlantOwner, removePlant);

router.post("/addImage",requireAuth,areYouThePlantOwner,upload.single("file"),addImageFromPlant)
router.delete("/deleteImage/:plantId/:imageId",  requireAuth,areYouThePlantOwner, removeImageFromPlant);

export default router;
