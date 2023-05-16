import { Router } from "express";
import {getPlantSitting,getOnePlantSitting,newPlantSitting,updatePlantSitting,removePlantSitting} from "../controllers/plantSitting.controller"


const router = Router();

import  {requireAuth,isItBotanist} from "../middleware/AuthMiddleware";

router.get("/",  requireAuth, getPlantSitting);
router.get("/:plantSittingId",  requireAuth, getOnePlantSitting);
router.post("/",  requireAuth,isItBotanist, newPlantSitting);
router.post("/:plantSittingId",requireAuth,isItBotanist, updatePlantSitting);
router.delete("/:plantSittingId",  requireAuth,isItBotanist, removePlantSitting);
export default router;
