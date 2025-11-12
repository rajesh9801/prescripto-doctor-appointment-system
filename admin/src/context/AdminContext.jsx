import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem("aToken") ? localStorage.getItem('aToken'):"");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Keep localStorage in sync
  useEffect(() => {
    if (aToken) {
      localStorage.setItem("aToken", aToken);
    } else {
      localStorage.removeItem("aToken");
    }
  }, [aToken]);

  const authHeaders = {
    headers: { Authorization: `Bearer ${aToken}` },
  };

  // ✅ Fetch all doctors
  const getAllDoctors = async () => {
    if (!aToken) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, authHeaders);
      if (data.success) {
        setDoctors(data.doctors);
        console.log("Doctors fetched:", data.doctors);
      } else {
        toast.error(data.message || "Failed to load doctors");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching doctors");
    }
  };

  // ✅ Toggle doctor availability
  const toggleDoctorAvailability = async (docId) => {
    if (!aToken) return;
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/admin/toggle-availability/${docId}`,
        {},
        authHeaders
      );

      if (data.success) {
        toast.success(data.message);
        setDoctors((prev) =>
          prev.map((doc) =>
            doc._id === docId ? { ...doc, available: data.available } : doc
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to toggle availability");
    }
  };

  // ✅ Fetch all appointments
  const getAllAppointments = async () => {
    if (!aToken) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, authHeaders);
      if (data.success) {
        setAppointments(data.appointments);
        // console.log("Appointments fetched:", data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching appointments");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/cancel-appointment`,
        { appointmentId },      // ✅ body
        authHeaders             // ✅ config (headers)
      );

      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Cancel appointment error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const dashboardData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/dashboard', authHeaders)
      if (data.success) {
        setDashData(data.dashData);
        
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching appointments");
    }
  }
  useEffect(() => {
    if (aToken) {
      dashboardData();
    }
  },[]);

  // 🗓 Format date from slotDate ("11_10_2025")
    const formatDate = (slotDate) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        if (!slotDate) return "";
        const [day, month, year] = slotDate.split("_");
        return `${day} ${months[parseInt(month) - 1]} ${year}`;
    };

  // ✅ Context value
  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    setDoctors,
    getAllDoctors,
    toggleDoctorAvailability,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashData,
    formatDate,
    dashboardData,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
