// routes/destinations.js
import express from "express";
import multer from "multer";
const router = express.Router();
import {
  createDestination,
  getDestination

} from "../controllers/destinationController.js";
import auth from "../middleware/auth.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });


// Note: protect middleware (JWT) omitted here — add if search requires auth

// Protected
router.post("/submit", upload.array("images", 5), auth, createDestination);
router.get("/get",getDestination)


export default router;