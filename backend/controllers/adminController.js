import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import doctorModel from "../models/doctorModel.js";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables
import jwt from 'jsonwebtoken'
import AppointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const addDoctor = async (req, res) => {
  try {
    // --------------------------
    // 1️⃣ Debug received data
    // --------------------------
    console.log("Body received:", req.body);
    console.log("File received:", req.file);

    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      available,
    } = req.body;

    const imageFile = req.file;

    // --------------------------
    // 2️⃣ Validate required fields
    // --------------------------
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !fees ||
      !address ||
      !imageFile
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required details or image",
      });
    }

    // --------------------------
    // 3️⃣ Validate email & password
    // --------------------------
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Password must be at least 8 characters" });
    }

    // --------------------------
    // 4️⃣ Parse address safely
    // --------------------------
    let parsedAddress;
    try {
      parsedAddress = typeof address === "string" ? JSON.parse(address) : address;
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid address format" });
    }

    // --------------------------
    // 5️⃣ Validate fees
    // --------------------------
    const feesNumber = Number(fees);
    if (isNaN(feesNumber)) {
      return res.status(400).json({ success: false, message: "Fees must be a number" });
    }

    // --------------------------
    // 6️⃣ Hash password
    // --------------------------
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // --------------------------
    // 7️⃣ Upload image to Cloudinary safely
    // --------------------------
    let imageUrl = "";
    try {
      const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
        folder: "doctors",
      });
      imageUrl = uploadResult.secure_url;
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return res
        .status(500)
        .json({ success: false, message: "Image upload failed", error: err.message });
    }

    // --------------------------
    // 8️⃣ Save doctor to DB
    // --------------------------
    const doctorData = new doctorModel({
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      speciality,
      degree,
      experience,
      about: about || "",
      fees: feesNumber,
      address: parsedAddress,
      available: available === "true" || available === true,
      date: Date.now(),
    });

    await doctorData.save();

    // --------------------------
    // 9️⃣ Return doctor without password
    // --------------------------
    const { password: _, ...doctorWithoutPassword } = doctorData._doc;

    return res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor: doctorWithoutPassword,
    });
  } catch (error) {
    console.error("Error in addDoctor:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


//API for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required details",
      });
    }

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" } // token valid for 1 day
      );

      return res.json({
        success: true,
        token,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Email or Password is not matching",
      });
    }
  } catch (error) {
    console.error("Error in loginAdmin:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//API to get all doctors list for admin panel
const allDoctor = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password')
    res.json({
      success: true,
      doctors
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
export { addDoctor, adminLogin, allDoctor };

//API to get all appointment list

export const appointmentAdmin = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find({});
    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ API to cancel user appointment from Admin
export const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    // if (!appointmentId)
    //   return res.status(400).json({ success: false, message: "Appointment ID is required" });

    const appointment = await AppointmentModel.findById(appointmentId);
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


//API to get Dashbord data for admin [pannel]
export const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const appointments = await AppointmentModel.find({})

    const dashData = {
      doctors: doctors.length,
      patients:users.length,
      appointments:appointments.length,
      latestAppointments: [...appointments].reverse().slice(0, 5)
    }

    res.json({
      success:true,
      dashData
    })

  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message,
    })
  }
}