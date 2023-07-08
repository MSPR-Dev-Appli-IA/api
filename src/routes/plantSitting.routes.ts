import { Router } from "express";
import {getPlantSitting,getOnePlantSitting,newPlantSitting,updatePlantSitting,removePlantSitting} from "../controllers/plantSitting.controller"
import  {areyouThePlantOwner} from "../middleware/PlantMiddleware";

const router = Router();

import  {requireAuth} from "../middleware/AuthMiddleware";

router.get("/", requireAuth, getPlantSitting);
router.post("/", requireAuth, areyouThePlantOwner, newPlantSitting);
router.put("/", requireAuth, updatePlantSitting);

router.get("/:plantSittingId", requireAuth, getOnePlantSitting);
router.delete("/:plantSittingId", requireAuth, areyouThePlantOwner, removePlantSitting);

export default router;
