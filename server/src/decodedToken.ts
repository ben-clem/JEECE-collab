import { Request } from "express";
import jwt from "jsonwebtoken";
import { __secret__ } from "./constants";

export const decodeToken = (req: Request, requireAuth = true) => {
  const token = req.cookies.userToken

  if (token) {
    const decoded = jwt.verify(token, __secret__);
    return decoded;
  }

  if (requireAuth) {
    throw new Error("Login in to access resource");
  }
  return null;
};


