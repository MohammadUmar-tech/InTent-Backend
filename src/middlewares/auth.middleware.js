import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel
      .findById(decoded.id)
      .select("-password -otp -otpExpiry");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Authentication Middleware Error  :${error}` });
  }
};
