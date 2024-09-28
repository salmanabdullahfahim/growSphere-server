import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TUserRole } from "../module/User/user.interface";
import config from "../../config";
import { User } from "../module/User/user.model";

const auth = (...RequiredRole: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    // check if the token is provided by the client
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        statusCode: 401,
        message: "You have no access to this route",
      });
    }

    // Extract the token from the "Bearer <token>" format
    const token = authorizationHeader.split(" ")[1];

    // check if the token is valid
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid Token");
    }

    const { email, role } = decoded;

    // checking if the user exists
    const user = await User.isUserExistsByEmail(email);
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        statusCode: 401,
        message: "You have no access to this route",
      });
    }

    // checking if the user has the required role
    if (RequiredRole && !RequiredRole.includes(role)) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        statusCode: 401,
        message: "You have no access to this route",
      });
    }

    // attaching the decoded token to the request object
    req.user = decoded;
    next();
  });
};

export default auth;
