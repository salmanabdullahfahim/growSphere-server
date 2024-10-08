import express from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userValidations } from "./user.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";

const router = express.Router();

router.get(
  "/:email",
  auth(USER_ROLE.user, USER_ROLE.admin),
  userController.getUserByEmail
);

router.get("/", auth(USER_ROLE.admin), userController.getAllUsers);
router.get(
  "/singleUser/:id",
  auth(USER_ROLE.user, USER_ROLE.admin),
  userController.getUserById
);

router.put(
  "/updateProfile/:id",
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(userValidations.updateUserValidationSchema),
  userController.updateUser
);

router.put(
  "/changeStatus/:id",
  auth(USER_ROLE.admin),
  userController.changeUserStatus
);

router.post(
  "/verify/:id",
  auth(USER_ROLE.user, USER_ROLE.admin),
  userController.verifyUser
);

router.post("/follow/:id", userController.followUser);

router.post("/unfollow/:id", userController.unfollowUser);

router.post("/favorite/:id", userController.favoritePost);
router.post("/unfavorite/:id", userController.unfavoritePost);
router.get("/favorites/:id", userController.getUserFavoritesPosts);

export const userRoutes = router;
