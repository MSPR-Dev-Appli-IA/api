import { Router } from "express";
import  auth from "./auth.routes";
import species from "./species.routes"
import plant from "./plant.routes"
import user from "./user.routes"
import plantSitting from "./plantSitting.routes"
import address from "./address.routes"
import message from './message.routes'
import conversation from "./conversation.routes";


const router = Router()

router.use("/api/auth", auth); 
router.use("/api/species", species);
router.use("/api/plant", plant);
router.use("/api/user", user);
router.use("/api/plantSitting", plantSitting);
router.use("/api/address", address)
router.use("/api/message", message);
router.use("/api/conversation", conversation)
export default router;