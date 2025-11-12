import bcrypt from "bcryptjs";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";


export const toggleDoctorAvailability = async (req, res) => {
  try {
    const { docId } = req.params; // ✅ take from URL param

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    doctor.available = !doctor.available; // ✅ flip availability
    await doctor.save();

    res.json({
      success: true,
      message: `Doctor is now ${doctor.available ? "Available" : "Unavailable"}`,
      available: doctor.available,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//API to get all doctors list for admin panel
export const doctorsList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select({ password: 0, email: 0 });
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
};

// API for doctor login

export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2️⃣ Find doctor by email
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 4️⃣ Generate JWT Token
    const token = jwt.sign(
      { id: doctor._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // 🟢 Expiry added for safety
    );

    // 5️⃣ Send response (omit sensitive info)
    res.json({
      success: true,
      message: "Doctor logged in successfully",
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        speciality: doctor.speciality,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// ✅ API to get doctor appointments for doctor panel
export const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.docId; // always set by middleware

    if (!docId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID not found in request.",
      });
    }

    const appointments = await appointmentModel
      .find({ docId })
      .sort({ date: -1 });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Appointments fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};


// ✅ API to cancel user appointment from doctor panel
export const appointmentComplete = async (req, res) => {
  try {
    const docId = req.docId
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (appointment && appointment.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
      return res.json({ success: true, message: 'Appointment Completed' })
    }
    else {
      return res.json({ success: false, message: "Mark Failed " });
    }
  } catch (error) {
    console.error("❌ Error cancelling appointment:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const appointmentCancel = async (req, res) => {
  try {
    const docId = req.docId
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (appointment && appointment.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
      return res.json({ success: true, message: 'Appointment Cancelled' })
    }
    else {
      return res.json({ success: false, message: "Cancellation Failed" });
    }
  } catch (error) {
    console.error("❌ Error cancelling appointment:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ API to get dashboard data for doctor panel
export const doctorDashboard = async (req, res) => {
  try {
    const docId = req.docId; // ✅ Get doctor ID from auth middleware

    // ✅ Get all appointments for this doctor
    const appointments = await appointmentModel.find({ docId });

    // ✅ Calculate total earnings (only completed or paid appointments)
    let earning = 0;
    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earning += item.amount;
      }
    });

    // ✅ Count unique patients
    const patients = new Set();
    appointments.forEach((item) => {
      patients.add(item.userId.toString());
    });

    // ✅ Prepare dashboard summary
    const dashData = {
      earning,
      appointments: appointments.length,
      patients: patients.size,
      latestAppointments: [...appointments].reverse().slice(0, 5),
    };

    return res.json({
      success: true,
      dashData,
    });
  } catch (error) {
    console.error("❌ Error fetching doctor dashboard:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};


// ✅ GET DOCTOR PROFILE
export const doctorProfile = async (req, res) => {
  try {
    const docId = req.docId;

    const profileData = await doctorModel.findById(docId).select("-password");

    if (!profileData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    res.json({
      success: true,
      profileData,
    });
  } catch (error) {
    console.error("❌ Error fetching doctor profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ UPDATE DOCTOR PROFILE
export const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.docId;
    const { fees, address, available, about, image } = req.body;

    // 🧩 Only update provided fields
    const updateFields = {};
    if (fees !== undefined) updateFields.fees = fees;
    if (address !== undefined) updateFields.address = address;
    if (available !== undefined) updateFields.available = available;
    if (about !== undefined) updateFields.about = about;
    if (image !== undefined) updateFields.image = image;

    const updated = await doctorModel
      .findByIdAndUpdate(docId, updateFields, { new: true, runValidators: true })
      .select("-password");

    if (!updated) {
      return res.json({
        success: false,
        message: "Doctor not found or update failed",
      });
    }

    res.json({
      success: true,
      message: "Profile Updated Successfully",
      updated,
    });
  } catch (error) {
    console.error("❌ Error updating doctor profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
