import express from "express";
const router = express.Router();
import { UserController } from "../controllers/user-controllers";
import { InSystemController } from "../controllers/checkAuth-checkRole-controllers";
import loginValidator from "../validators/loginValidator";
import registrationValidator from "../validators/registerValidarot";
import checkAuth from "../middleware/checkAuth";
import checkRoles from "../middleware/checkRoles";

router.post("/auth/register", registrationValidator, UserController.register);
router.post("/auth/login", loginValidator, UserController.login);

router.get("/auth/profile/", checkAuth, UserController.profile);

router.post("/inSystem", checkAuth, InSystemController.inSystem);
router.post("/isAdmin", checkAuth, checkRoles('admin'), InSystemController.isAdmin);

export default router;
