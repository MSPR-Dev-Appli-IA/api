import { Router } from "express";
import {getPlantSitting,getOnePlantSitting,newPlantSitting,updatePlantSitting,removePlantSitting} from "../controllers/plantSitting.controller"
import  {areyouThePlantOwner} from "../middleware/PlantMiddleware";

const router = Router();

import  {requireAuth} from "../middleware/AuthMiddleware";

router.get("/",  requireAuth, getPlantSitting);
router.get("/:plantSittingId",  requireAuth, getOnePlantSitting);
router.post("/:plantId",  requireAuth,areyouThePlantOwner, newPlantSitting);
router.post("/:plantSittingId",requireAuth, updatePlantSitting);
router.delete("/:plantSittingId",  requireAuth,areyouThePlantOwner, removePlantSitting);
export default router;
