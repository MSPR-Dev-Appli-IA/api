import { Router } from "express";
import  {requireAuth} from "../middleware/AuthMiddleware";

import {acceptRequest, newRequest, refuseRequest, removeRequest} from "../controllers/request.controller";
import {areYouThePlantOwner} from "../middleware/PlantMiddleware";
import {
    areThePlantSittingStillAvailable,
    areThePlantSittingStillAvailableFromTheRequest,
    areyouThePlantSittingOwnerFromTheRequest
} from "../middleware/PlantSittingMiddleware";
import {areyouTheRequestOwner} from "../middleware/RequestMiddleware";
import {
    getOnePlantSitting,
    getPlantSitting,
    newPlantSitting, removePlantSitting,
    updatePlantSitting
} from "../controllers/plantSitting.controller";

const router = Router();

router.get("/", requireAuth, getPlantSitting);
router.post("/", requireAuth, areYouThePlantOwner, newPlantSitting);
router.put("/", requireAuth, updatePlantSitting);

router.post("/accept",  requireAuth, areyouThePlantSittingOwnerFromTheRequest, areThePlantSittingStillAvailableFromTheRequest, acceptRequest);
router.post("/refuse",  requireAuth, areyouThePlantSittingOwnerFromTheRequest, areThePlantSittingStillAvailableFromTheRequest, refuseRequest);

router.post("/sendRequest",  requireAuth, areThePlantSittingStillAvailable, newRequest);
router.delete("/deleteRequest/:requestId", requireAuth, areyouTheRequestOwner, areThePlantSittingStillAvailable, removeRequest);

router.get("/:plantSittingId", requireAuth, getOnePlantSitting);
router.delete("/:plantSittingId", requireAuth, areYouThePlantOwner, removePlantSitting);

export default router;