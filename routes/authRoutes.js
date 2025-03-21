import express from "express";
import { login, register } from "../controller/authController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/register",upload.single("avatar"), register);
router.post("/login", login);

export default router;

