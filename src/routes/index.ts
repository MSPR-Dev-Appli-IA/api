import { Router } from "express";
import  auth from "./auth.routes";
import species from "./species.routes"
import plant from "./plant.routes"


const router = Router()



router.use("/api/auth", auth); 
router.use("/api/species", species);
router.use("/api/plant", plant);
export default router;