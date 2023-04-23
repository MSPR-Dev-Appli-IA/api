import { Router } from "express";
import {getSpecies,createSpecies} from "../controllers/species.controller"
import upload from '../config/image.config'

const router = Router();

import  {requireAuth} from "../middleware/AuthMiddleware";

router.get("/",  requireAuth, getSpecies);
router.post("/",  requireAuth,upload.array("files"), createSpecies);

export default router;
