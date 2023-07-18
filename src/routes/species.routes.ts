import { Router } from "express";
import {getSpecies,getOneSpecies,removeSpecies} from "../controllers/species.controller"

const router = Router();

import  {requireAuth,isItBotanist} from "../middleware/AuthMiddleware";

router.get("/", requireAuth, getSpecies);


router.get("/:speciesId",  requireAuth, getOneSpecies);
router.delete("/:speciedId",  requireAuth,isItBotanist, removeSpecies);





export default router;
