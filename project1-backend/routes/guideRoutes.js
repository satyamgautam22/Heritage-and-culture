import express from "express";
import {register,login,getGuidesByLocation,getAllGuide} from "../controllers/guideController.js";


const guideRouter =express.Router();

guideRouter.post("/register",register)
guideRouter.post("/login",login)
guideRouter.get("/:location", getGuidesByLocation);
guideRouter.get("/meta", getAllGuide);



export default guideRouter;
