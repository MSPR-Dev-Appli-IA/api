import { Router } from "express";
import {acceptRequest,refuseRequest,newRequest,removeRequest,getOneRequest} from "../controllers/request.controller"
import  {requireAuth} from "../middleware/AuthMiddleware";
import {
    areThePlantSittingStillAvailable,
    areThePlantSittingStillAvailableFromTheRequest,
    areyouThePlantSittingOwner,
    areyouThePlantSittingOwnerFromTheRequest
} from "../middleware/PlantSittingMiddleware";
import { areyouTheRequestOwner, areyouThePlantSittingOwnerOrTheBooker } from "../middleware/RequestMiddleware";
import {getOnePlantSittingWithRequest} from "../controllers/plantSitting.controller";

const router = Router();

router.post("/",  requireAuth, areyouThePlantSittingOwner, areThePlantSittingStillAvailable, newRequest);

router.get("/:requestId",  requireAuth,areyouThePlantSittingOwnerOrTheBooker, getOneRequest);
router.get("/request/:plantSittingId",  requireAuth,areyouThePlantSittingOwner, getOnePlantSittingWithRequest);

router.post("/accept/:requestId",  requireAuth, areyouThePlantSittingOwnerFromTheRequest, areThePlantSittingStillAvailableFromTheRequest ,acceptRequest);
router.post("/refuse/:requestId",  requireAuth, areyouThePlantSittingOwnerFromTheRequest, areThePlantSittingStillAvailableFromTheRequest, refuseRequest);



router.delete("/:requestId",  requireAuth,areyouTheRequestOwner, removeRequest);

export default router;
