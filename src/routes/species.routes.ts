import { Router } from "express";
import {getSpecies} from "../controllers/species.controller"

const router = Router();

import  {requireAuth} from "../middleware/AuthMiddleware";

router.get("/",  requireAuth, getSpecies);

export default router;
