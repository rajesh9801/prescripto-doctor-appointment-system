import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: { 
      type: String, 
      required: true 
    }, // ID of the user (patient)
    
    docId: { 
      type: String, 
      required: true 
    }, // ID of the doctor

    slotDate: { 
      type: String, 
      required: true 
    }, // Appointment date (e.g. "2025-10-09")

    slotTime: { 
      type: String, 
      required: true 
    }, // Appointment time (e.g. "10:30 AM")

    userData: { 
      type: Object, 
      required: true 
    }, // Snapshot of user info at booking time (name, email, etc.)

    docData: { 
      type: Object, 
      required: true 
    }, // Snapshot of doctor info at booking time (name, specialty, etc.)

    amount: { 
      type: Number, 
      required: true 
    }, // Fee for the appointment

    date: { 
      type: Number, 
      required: true 
    }, // Timestamp for sorting/filtering

    cancelled: { 
      type: Boolean, 
      default: false 
    }, // If appointment was cancelled

    payment: { 
      type: Boolean, 
      default: false 
    }, // Whether payment completed

    isCompleted: { 
      type: Boolean, 
      default: false 
    }, // Whether appointment has been attended/completed
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const AppointmentModel = mongoose.model("Appointment", appointmentSchema);
export default AppointmentModel;
