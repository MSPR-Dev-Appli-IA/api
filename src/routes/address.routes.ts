import { Router } from "express";
import  {requireAuth} from "../middleware/AuthMiddleware";
import {getAddressCoordinates} from "../controllers/address.controller";


const router = Router();

router.post("/", requireAuth, getAddressCoordinates);

export default router;