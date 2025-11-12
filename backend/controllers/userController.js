import validator from "validator";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables
import jwt from 'jsonwebtoken'
import streamifier from "streamifier";
import cloudinary from '../config/cloudinary.js'
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import Razorpay from "razorpay";


// API to register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required details",
      });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};


// API to login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const userProfileData = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const userData = await userModel.findOne({ email });


    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log("User found:", userData);

    // Success response
    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      userData,
    });

  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching user data",
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from your auth middleware
    const { name, phone, gender, dob, addressLine1, addressLine2 } = req.body;

    const updateData = {
      name,
      phone,
      gender,
      dob,
      address: { line1: addressLine1, line2: addressLine2 },
    };

    // ✅ Upload to Cloudinary if file exists
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "user_profiles" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      updateData.image = result.secure_url;
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true });

    res.json({ success: true, userData: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
};

// API to book appointement
export const bookAppointement = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body
    const userId = req.user.id;
    const docData = await doctorModel.findById(docId).select('-password')

    if (!docData.available) {
      return res.json({
        success: false,
        message: "Doctor not available"
      })
    }
    let slots_booked = docData.slots_booked

    // checking for slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({
          success: false,
          message: "Slot not available"
        })
      } else {
        slots_booked[slotDate].push(slotTime)
      }
    }
    else {
      slots_booked[slotDate] = []
      slots_booked[slotDate].push(slotTime)
    }

    const userData = await userModel.findById(userId).select('-password')
    delete docData.slots_booked
    const appointementData = {
      userId, docId, slotDate, slotTime, userData, docData, amount: docData.fees,
      date: Date.now()
    }

    const newAppointment = new appointmentModel(appointementData)
    await newAppointment.save()

    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    res.json({
      success: true,
      message: "Appointement booked"
    })
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
}

//API to get user appointments for fronted my-appointment

export const listAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await appointmentModel.find({ userId })
    res.json({
      success: true,
      appointements: appointments,
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
}

// ✅ API to cancel user appointment from frontend
export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    if (!appointmentId)
      return res.status(400).json({ success: false, message: "Appointment ID is required" });

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment)
      return res.status(404).json({ success: false, message: "Appointment not found" });

    const doctor = await doctorModel.findById(appointment.docId);
    if (!doctor)
      return res.status(404).json({ success: false, message: "Doctor not found" });

    const { slotDate, slotTime } = appointment;

    // ✅ Proper slot cleanup with modification marking
    if (doctor.slots_booked && doctor.slots_booked[slotDate]) {
      doctor.slots_booked[slotDate] = doctor.slots_booked[slotDate].filter(
        (t) => t !== slotTime
      );

      if (doctor.slots_booked[slotDate].length === 0) {
        delete doctor.slots_booked[slotDate];
      }

      // 🔥 Ensure Mongoose knows the nested object changed
      doctor.markModified("slots_booked");
      await doctor.save();
    }

    // ✅ Mark appointment as cancelled
    appointment.cancelled = true;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully and slot is now available.",
    });
  } catch (error) {
    console.error("❌ Error cancelling appointment:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// ✅ Create Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// ✅ API to make payment of appointment using Razorpay
export const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    // ✅ Find appointment
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData || appointmentData.cancelled) {
      return res.status(400).json({
        success: false,
        message: "Appointment cancelled or not found",
      });
    }

    // ✅ Create Razorpay order options
    const options = {
      amount: appointmentData.amount * 100, // amount in paise
      currency: process.env.CURRENCY || "INR",
      receipt: appointmentId,
    };

    // ✅ Create order in Razorpay
    const order = await razorpayInstance.orders.create(options);

    // ✅ Send order details to frontend
    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Razorpay payment error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating Razorpay order",
      error: error.message,
    });
  }
};


// API to verify payment of razorpay payment
export const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)


    if (orderInfo.status === 'paid') {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
      res.json({
        success: true,
        message: "Payment Successful"
      })
    } else {
      res.json({
        success: false,
        message: "Payment Failed"
      })
    }

  } catch (error) {
    console.error("Razorpay payment error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while verifying Razorpay payment",
      error: error.message,
    });
  }
}
