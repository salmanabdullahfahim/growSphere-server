import express from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userValidations } from "./user.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";

const router = express.Router();

router.get("/:email", auth(USER_ROLE.user), userController.getUserByEmail);

router.patch(
  "/updateProfile/:id",
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(userValidations.updateUserValidationSchema),
  userController.updateUser
);

router.post("/follow/:id", userController.followUser);

router.post("/unfollow/:id", userController.unfollowUser);

export const userRoutes = router;
