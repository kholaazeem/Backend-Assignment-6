import jwt from "jsonwebtoken";
import Users from "../models/UsersSchema.js";

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization || "";

  if (authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return req.cookies?.token || null;
};

const attachUserFromToken = async (req) => {
  const token = getTokenFromRequest(req);
  if (!token) return null;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return Users.findById(decoded.id).select("-password");
};

const requireAuth = async (req, res, next) => {
  try {
    const user = await attachUserFromToken(req);

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "token not provided",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "invalid token",
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    req.user = await attachUserFromToken(req);
  } catch (error) {
    req.user = null;
  }

  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      status: false,
      message: "admin access required",
    });
  }

  next();
};

export { requireAuth, optionalAuth, requireAdmin };