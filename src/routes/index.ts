import { Router } from "express";
import  auth from "./auth.routes";
import species from "./species.routes"
import plant from "./plant.routes"
import user from "./user.routes"
import plantSitting from "./plantSitting.routes"


const router = Router()



router.use("/api/auth", auth); 
router.use("/api/species", species);
router.use("/api/plant", plant);
router.use("/api/user", user);
router.use("/api/plantSitting", plantSitting);
export default router;