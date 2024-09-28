import express from "express";

import { userValidations } from "../User/user.validation";
import { authController } from "./auth.controller";
import { authValidations } from "./auth.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(userValidations.userValidationSchema),
  authController.signUp
);

router.post(
  "/login",
  validateRequest(authValidations.loginValidationSchema),
  authController.loginUser
);

export const authRoutes = router;
