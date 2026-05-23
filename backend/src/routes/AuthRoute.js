import express from "express";
import multer from "multer";
import {
  addUser,
  allUsers,
  getUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  updateUser,
  UserProfile,
  dashboardOverview,
  updateUserRole,
  adminDeleteUser,
} from "../controllers/AuthControllers.js";
import { requireAdmin, requireAuth } from "../middlewares/auth.js";

const authroute = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

authroute.post("/signup", upload.single("profilePic"), addUser);
authroute.post("/login", loginUser);
authroute.post("/logout", logout);
authroute.post("/forgot-password", forgotPassword);
authroute.post("/reset-password/:token", resetPassword);
authroute.get("/profile", requireAuth, UserProfile);
authroute.get("/dashboard", requireAuth, requireAdmin, dashboardOverview);
authroute.get("/users", allUsers);
authroute.get("/users/:id", getUser);
authroute.put("/users/:id", upload.single("profilePic"), updateUser);
authroute.patch("/users/:id/role", requireAuth, requireAdmin, updateUserRole);
authroute.delete("/users/:id", requireAuth, requireAdmin, adminDeleteUser);

export default authroute;