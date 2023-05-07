import { Router } from "express";
import  auth from "./auth.routes";
import species from "./species.routes"


const router = Router()



router.use("/api/auth", auth);
router.use("/api/species", species);

export default router;