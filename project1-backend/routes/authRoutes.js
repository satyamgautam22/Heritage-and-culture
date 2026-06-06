import express from "express";
import { register, login,getAllUsers,logout ,getMyIp} from "../controllers/authConrtoller.js";
import auth from "../middleware/auth.js";



const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/users", auth,getAllUsers);
router.get("/ip",getMyIp)



export default router;
