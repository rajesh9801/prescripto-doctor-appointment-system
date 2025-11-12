import express from "express";
import {
  registerUser,
  loginUser,
  userProfileData,
  updateUserProfile,
  bookAppointement,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
} from "../controllers/userController.js";
import upload from "../middlewares/multer.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

// 🔐 Auth + User Management
userRouter.post("/signup", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/my-profile", authMiddleware, userProfileData);
userRouter.put("/update-profile", authMiddleware, upload.single("image"), updateUserProfile);

// 🩺 Appointment Routes
userRouter.post("/book-appointment", authMiddleware, bookAppointement);
userRouter.get("/appointments", authMiddleware, listAppointment);
userRouter.post("/cancel-appointment", authMiddleware, cancelAppointment);

// Payment Routes
userRouter.post('/payment-razorpay',authMiddleware,paymentRazorpay)
userRouter.post('/verifyRazorpay',authMiddleware,verifyRazorpay)
export default userRouter;
