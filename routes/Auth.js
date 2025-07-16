import express from "express";
import { register, login } from "../controllers/auth.js";
import {
  loginValidator,
  registerValidator,
} from "../middlewares/req_validator/userValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);
export default router;
