import express from "express";
import auth from "../middleware/auth.js";
import { getOrCreateChat } from "../controllers/chatController.js";

const router = express.Router();

router.get("/:userId", auth, getOrCreateChat);

export default router;
