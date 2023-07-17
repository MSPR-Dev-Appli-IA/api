import { Router } from "express";
import  {requireAuth} from "../middleware/AuthMiddleware";

import {acceptRequest, newRequest, refuseRequest, removeRequest} from "../controllers/request.controller";
import {RequestMiddleware} from "../middleware/RequestMiddleware";
import {PlantSittingController} from "../controllers/plantSitting.controller";
import {PlantSittingMiddleware} from "../middleware/PlantSittingMiddleware";
import {PlantMiddleware} from "../middleware/PlantMiddleware";

const router = Router();
const requestMiddleware = new RequestMiddleware()
const plantSittingMiddleware = new PlantSittingMiddleware()
const plantMiddleware = new PlantMiddleware();
const plantSittingController = new PlantSittingController()

router.get("/", requireAuth, plantSittingController.getAll);
router.post("/", requireAuth, plantMiddleware.areYouThePlantOwner, plantSittingController.create);
router.put("/", requireAuth, plantSittingController.update);

router.post("/accept",  requireAuth, plantSittingMiddleware.areyouThePlantSittingOwnerFromTheRequest, plantSittingMiddleware.areThePlantSittingStillAvailableFromTheRequest, acceptRequest);
router.post("/refuse",  requireAuth, plantSittingMiddleware.areyouThePlantSittingOwnerFromTheRequest, plantSittingMiddleware.areThePlantSittingStillAvailableFromTheRequest, refuseRequest);

router.post("/sendRequest",  requireAuth, plantSittingMiddleware.areThePlantSittingStillAvailable, newRequest);
router.delete("/deleteRequest/:requestId", requireAuth, requestMiddleware.areyouTheRequestOwner, plantSittingMiddleware.areThePlantSittingStillAvailable, removeRequest);

router.get("/:plantSittingId", requireAuth, plantSittingController.getOne);
router.delete("/:plantSittingId", requireAuth, plantMiddleware.areYouThePlantOwner, plantSittingController.delete);

export default router;