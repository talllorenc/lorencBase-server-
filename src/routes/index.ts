import express from "express";
const router = express.Router();
/****************CONTROLLERS**********************/
import { AuthController } from "../controllers/auth-controllers";
import { UserController } from "../controllers/user-controllers";
import { NoteController } from "../controllers/note-controllers";
import { RecaptchaController } from "../controllers/recaptcha-controller";
/****************VALIDATORS**********************/
import loginValidator from "../validators/loginValidator";
import registrationValidator from "../validators/registerValidarot";
import notesValidator from "../validators/notesValidator";
/****************MIDDLEWARES**********************/
import checkAuth from "../middleware/checkAuth";
import checkRoles from "../middleware/checkRoles";
import uploadImage from "../middleware/uploadFiles";

router.post("/auth/login", loginValidator, AuthController.login);//DONE
router.post("/auth/register", registrationValidator, AuthController.register);//DONE
router.get("/auth/refresh", AuthController.refresh);//DONE
router.post("/auth/logout", AuthController.logout);//DONE

router.get("/users/profile/", checkAuth, UserController.profile); //DONE
router.get("/users", checkAuth, UserController.getAllUsers); //DONE
router.get("/users/:id", UserController.getUserById); //DONE
router.delete("/users/:id", UserController.deleteUser); //DONE
router.patch("/users/:id", UserController.updateUser);

router.get("/notes", NoteController.getAll); //DONE
router.get("/notes/:slug", NoteController.getOneBySlug);//DONE
router.get("/notes/getOneId/:id", NoteController.getOneById);//DONE (ADMIN)
router.post("/notes", checkAuth, notesValidator, NoteController.create); //DONE
router.delete("/notes/:id", checkAuth, NoteController.delete); //DONE
router.patch("/notes/:id/like", checkAuth, NoteController.like);//DONE
router.patch("/notes/:id/unlike", checkAuth, NoteController.unlike);//DONE
router.patch("/notes/:id/favoriteAdd", checkAuth, NoteController.addToFavorites);
router.patch("/notes/:id/favoriteRemove", checkAuth, NoteController.removeFromFavorites);
router.post(
  "/notes/upload/",
  uploadImage.single("image"),
  NoteController.upload
); //DONE

router.post("/verify-recaptcha", RecaptchaController.validate); //DONE
router.get("/search", NoteController.search);

export default router;
