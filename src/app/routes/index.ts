import { Router } from "express";
import { authRoutes } from "../module/Auth/auth.route";

const router = Router();

const moduleRoutes = [{ path: "/auth", route: authRoutes }];

moduleRoutes.forEach((route) => router.use(route.path, route.route)); // This will automatically loop your routes that you will add in the moduleRoutes array

export default router;
