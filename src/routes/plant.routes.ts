import { Router } from "express";
import {getMyPlants,getOneOfMyPlant,newPlant,addImageFromPlant,removeImageFromPlant,removePlant,updatePlant} from "../controllers/plant.controller"
import upload from '../config/image.config'

const router = Router();

import  {requireAuth} from "../middleware/AuthMiddleware";

import  {areyouThePlantOwner} from "../middleware/PlantMiddleware";

router.get("/",  requireAuth, getMyPlants);
router.post("/",  requireAuth, newPlant);

router.get("/:plantId",  requireAuth,areyouThePlantOwner, getOneOfMyPlant);
router.post("/:plantId",  requireAuth,areyouThePlantOwner, updatePlant);
router.post("/addImage/:plantId",requireAuth,areyouThePlantOwner,upload.single("file"),addImageFromPlant)
router.delete("/deleteImage/:plantId/:imageId",  requireAuth,areyouThePlantOwner, removeImageFromPlant);
router.delete("/:plantId",  requireAuth,areyouThePlantOwner, removePlant);
export default router;
