import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

function MyAppointments() {
  const { token, backendUrl, getAllDoctors } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate()

  // 🧩 Fetch all appointments
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setAppointments(data.appointements.reverse());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load appointments");
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,

      handler: async (response) => {
        console.log(response)
        try {
          const { data } = await axios.post(backendUrl + '/api/user/verifyRazorpay', response, {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (data.success) {
            getUserAppointments()
            navigate('/my-appointments')
          }
        } catch (error) {
          console.log(error)
          toast.error(error.message)
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (data.success) {
        initPay(data.order)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
      getAllDoctors()
    };
  }, [token]);

  // ❌ Cancel an appointment
  const handleCancel = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Appointment cancelled successfully");

        // ✅ Instantly mark as cancelled in frontend
        setAppointments((prev) =>
          prev.map((a) =>
            a._id === appointmentId ? { ...a, cancelled: true } : a
          )
        );
      } else {
        toast.error(data.message || "Failed to cancel appointment");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // 🗓 Format date from slotDate ("11_10_2025")
  const formatDate = (slotDate) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (!slotDate) return "";
    const [day, month, year] = slotDate.split("_");
    return `${day} ${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">My Appointments</h2>

      {appointments.length === 0 ? (
        <p className="text-gray-500 text-center">You have no appointments yet.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {appointments.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              {/* Doctor Info */}
              <div className="flex gap-4 items-center">
                <img
                  src={item.docData?.image}
                  alt={item.docData?.name}
                  className="w-20 h-20 rounded-lg object-cover bg-gray-100"
                />
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {item.docData?.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{item.docData?.speciality}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Address:</span>{" "}
                    {item.docData?.address?.line1 || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date & Time:</span>{" "}
                    {formatDate(item.slotDate)} | {item.slotTime}
                  </p>
                </div>
              </div>

              {/* Right Section — Buttons or Status */}
              <div className="flex gap-3 mt-4 sm:mt-0">
                {/* Paid status */}
                {item.payment && (
                  <span className="border border-green-500 text-green-600 px-5 py-2 rounded-lg font-medium bg-green-50 cursor-not-allowed">
                    Paid
                  </span>
                )}

                {/* Cancelled status */}
                {item.cancelled && !item.isCompleted && (
                  <span className="border border-red-400 text-red-500 px-5 py-2 rounded-lg font-medium bg-red-50 cursor-not-allowed">
                    Appointment Cancelled
                  </span>
                )}

                {/* Pay Online button: only show if not paid */}
                {!item.payment && !item.cancelled && !item.isCompleted && (
                  <button
                    className="border border-blue-500 text-blue-600 px-5 py-2 rounded-lg font-medium hover:bg-blue-500 hover:text-white transition-all"
                    onClick={() => appointmentRazorpay(item._id)}
                  >
                    Pay Online
                  </button>
                )}

                {/* Cancel button: only show if not cancelled */}
                {!item.cancelled && !item.isCompleted &&(
                  <button
                    onClick={() => handleCancel(item._id)}
                    className="border border-red-500 text-red-600 px-5 py-2 rounded-lg font-medium hover:bg-red-500 hover:text-white transition-all"
                  >
                    Cancel Appointment
                  </button>
                )}

                {item.isCompleted &&(
                  <button
                    className="border border-green-500 text-black-600 px-5 py-2 rounded-lg font-medium hover:bg-green-500 hover:text-white transition-all"
                  >
                    Completed
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyAppointments;
