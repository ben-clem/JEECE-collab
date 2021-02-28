import { Request } from "express";
import jwt from "jsonwebtoken";
import { __secret__ } from "./constants";

export const decodedToken = (req: Request, requireAuth = true) => {
  const header = req.headers.authorization;

  if (header) {
    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, __secret__);
    return decoded;
  }


  
  if (requireAuth) {
    throw new Error("Login in to access resource");
  }
  return null;
};


