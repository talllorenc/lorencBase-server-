import express from "express";
const router = express.Router();
/****************CONTROLLERS**********************/
import { AuthController } from "../controllers/auth-controllers";
import { UserController } from "../controllers/user-controllers";
import { NoteController } from "../controllers/note-controllers";
import { RecaptchaController } from "../controllers/recaptcha-controller";
import { helpersController } from "../controllers/helpers-controllers";
/****************VALIDATORS**********************/
import loginValidator from "../validators/loginValidator";
import registrationValidator from "../validators/registerValidarot";
import notesValidator from "../validators/notesValidator";
/****************MIDDLEWARES**********************/
import checkAuth from "../middleware/checkAuth";
import checkRoles from "../middleware/checkRoles";
import uploadImage from "../middleware/uploadFiles";

router.post("/auth/login", loginValidator, AuthController.login);
router.post("/auth/register", registrationValidator, AuthController.register);

router.get("/users/profile/", checkAuth, UserController.profile); //DONE
router.get("/users", UserController.getAllUsers); //DONE
router.get("/users/:id", UserController.getUserById); //DONE
router.delete("/users/:id", UserController.deleteUser); //DONE
router.patch("/users/:id", UserController.updateUser);

router.get("/notes", NoteController.getAll); //DONE
router.post("/notes/create/", notesValidator, NoteController.create); //DONE
router.delete("/notes/:id", NoteController.delete); //DONE
router.post(
  "/notes/upload/",
  uploadImage.single("image"),
  NoteController.upload
); //DONE

router.post("/verify-recaptcha", RecaptchaController.validate); //DONE
router.get("/helpers/randomPassword", helpersController.randomPassword); 

export default router;
