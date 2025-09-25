import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "no token provided" });
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "invalid token format" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "invalid token" });
    } else {
      return res.status(401).json({ error: "authentication failed" });
    }
  }
};
