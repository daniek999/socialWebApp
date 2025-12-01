import { Router } from "express";
import { verifyAdmin, verifyStatus, verifyToken, verifyVerification } from "../middleware/auth.js";
import { createAchievement, deleteAchievement, getGlobalAchievements, getUserAchievements } from "../handlers/achievement.handler.js";

/**
 * ---------------------------------------------------------------------------------
 * HANDLER                  | METHOD    | ACCESS    | ROUTE                           
 * ---------------------------------------------------------------------------------
 * getGlobalAchievements()  | GET       | User      | 'api/achievements/global'
 * getUserAchievements()    | GET       | User      | 'api/achievements/:idUser'
 * createAchievement()      | POST      | Admin     | 'api/achievements/'
 * deleteAchievement()      | DELETE    | Admin     | 'api/achievements/:idAchievement'
 * ---------------------------------------------------------------------------------
 */

const achievementRouter = Router();

// [MIDDLEWARES] 
achievementRouter.use(verifyToken);
achievementRouter.use(verifyVerification);
achievementRouter.use(verifyStatus);
// [ROUTES]
achievementRouter.get("/global", getGlobalAchievements);
achievementRouter.get("/:idUser", getUserAchievements);
achievementRouter.post("/", verifyAdmin, createAchievement);
achievementRouter.delete("/:idAchievement", verifyAdmin, deleteAchievement);

export default achievementRouter;