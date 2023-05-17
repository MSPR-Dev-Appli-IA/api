import { Router } from "express";
import {getPlantSitting,getOnePlantSitting,newPlantSitting,updatePlantSitting,removePlantSitting,getOnePlantSittingWithRequest} from "../controllers/plantSitting.controller"
import  {areyouThePlantOwner} from "../middleware/PlantMiddleware";

const router = Router();

import  {requireAuth} from "../middleware/AuthMiddleware";
import { areyouThePlantSittingOwner } from "../middleware/PlantSittingMiddleware";

router.get("/",  requireAuth, getPlantSitting);
router.get("/:plantSittingId",  requireAuth, getOnePlantSitting);
router.get("/request/:plantSittingId",  requireAuth,areyouThePlantSittingOwner, getOnePlantSittingWithRequest);
router.post("/:plantId",  requireAuth,areyouThePlantOwner, newPlantSitting);
router.post("/:plantSittingId",requireAuth,areyouThePlantSittingOwner, updatePlantSitting);
router.delete("/:plantSittingId",  requireAuth,areyouThePlantSittingOwner, removePlantSitting);
export default router;
