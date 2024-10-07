import express from "express";

import { userValidations } from "../User/user.validation";
import { authController } from "./auth.controller";
import { authValidations } from "./auth.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";

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

router.post(
  "/change-password",
  auth(USER_ROLE.user, USER_ROLE.admin),
  authController.changePassword
);

router.post(
  "/forget-password",
  validateRequest(authValidations.forgetPasswordValidationSchema),
  authController.forgetPassword
);

export const authRoutes = router;
