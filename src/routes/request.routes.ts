import { Router } from "express";
import {acceptRequest,refuseRequest,newRequest,removeRequest,getOneRequest} from "../controllers/request.controller"

const router = Router();

import  {requireAuth} from "../middleware/AuthMiddleware";
import { areThePlantSittingStillAvailable, areThePlantSittingStillAvailableFromTheRequest, areyouThePlantSittingOwner, areyouThePlantSittingOwnerFromTheRequest } from "../middleware/PlantSittingMiddleware";
import { areyouTheRequestOwner, areyouThePlantSittingOwnerOrTheBooker } from "../middleware/RequestMiddleware";

router.get("/:requestId",  requireAuth,areyouThePlantSittingOwnerOrTheBooker, getOneRequest);
router.post("/accept/:requestId",  requireAuth,areyouThePlantSittingOwnerFromTheRequest,areThePlantSittingStillAvailableFromTheRequest ,acceptRequest);
router.post("/refuse/:requestId",  requireAuth,areyouThePlantSittingOwnerFromTheRequest,areThePlantSittingStillAvailableFromTheRequest, refuseRequest);
router.post("/:plantSittingId",  requireAuth,areyouThePlantSittingOwner,areThePlantSittingStillAvailable, newRequest);
router.delete("/:requestId",  requireAuth,areyouTheRequestOwner, removeRequest);
export default router;
