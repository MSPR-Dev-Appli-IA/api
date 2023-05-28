import { Router } from "express";
import {getMyPlants,getOneOfMyPlant,newPlant,addImageFromPlant,removeImageFromPlant,removePlant,updatePlant} from "../controllers/plant.controller"
import upload from '../config/image.config'

const router = Router();

import  {requireAuth} from "../middleware/AuthMiddleware";

import  {areyouThePlantOwner} from "../middleware/PlantMiddleware";

router.get("/",  requireAuth, getMyPlants);
router.post("/",  requireAuth, newPlant);
router.put("/",  requireAuth, areyouThePlantOwner, updatePlant);

router.get("/:plantId",  requireAuth,areyouThePlantOwner, getOneOfMyPlant);
router.delete("/:plantId",  requireAuth,areyouThePlantOwner, removePlant);

router.post("/addImage",requireAuth,areyouThePlantOwner,upload.single("file"),addImageFromPlant)
router.delete("/deleteImage/:plantId/:imageId",  requireAuth,areyouThePlantOwner, removeImageFromPlant);

export default router;
