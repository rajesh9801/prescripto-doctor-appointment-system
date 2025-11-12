import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { MdEventAvailable } from "react-icons/md";
import { FaUserMd, FaUser } from "react-icons/fa";
import { assets } from "../../assets/assets";

const Dashboard = () => {
  const { dashData, formatDate, cancelAppointment, dashboardData } =
    useContext(AdminContext); // ✅ includes dashboard data fetcher

  useEffect(() => {
    if (!dashData) {
      dashboardData(); // ✅ load data on mount if missing
    }
  }, [dashData]);

  if (!dashData) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading dashboard data...
      </div>
    );
  }

  const stats = [
    {
      title: "Doctors",
      count: dashData.doctors,
      icon: <FaUserMd className="text-4xl text-blue-500" />,
    },
    {
      title: "Appointments",
      count: dashData.appointments, // ✅ corrected spelling
      icon: <MdEventAvailable className="text-4xl text-purple-500" />,
    },
    {
      title: "Patients",
      count: dashData.patients,
      icon: <FaUser className="text-4xl text-sky-500" />,
    },
  ];

  // ✅ Cancel & refresh dashboard
  const handleCancel = async (id) => {
    await cancelAppointment(id);
    await dashboardData();
  };

  return (
    <div className="p-6 w-full max-w-4xl mx-auto">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-sm border rounded-2xl flex items-center p-4 gap-4 hover:shadow-md transition-all"
          >
            <div className="p-3 bg-blue-50 rounded-xl">{item.icon}</div>
            <div>
              <p className="text-2xl font-semibold text-gray-800">
                {item.count ?? 0}
              </p>
              <p className="text-gray-500 text-sm">{item.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Appointments */}
      <div className="bg-white border rounded-2xl shadow-sm p-4">
        <h3 className="flex items-center gap-2 font-medium text-gray-700 border-b pb-3 mb-4">
          <MdEventAvailable className="text-blue-500" />
          Latest Appointments
        </h3>

        <div className="space-y-4">
          {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
            dashData.latestAppointments.map((apt, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b pb-3 last:border-0 hover:bg-gray-50 transition"
              >
                {/* Left: Doctor Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={apt.docData?.image || assets.doctor_icon}
                    alt="Doctor"
                    className="w-12 h-12 rounded-full border object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {apt.docData?.name || "Doctor"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {apt.userData?.name
                        ? `with ${apt.userData.name}`
                        : "User not found"}
                    </p>
                    <p className="text-xs text-gray-400">
                      Booking on {formatDate(apt.slotDate)}, {apt.slotTime}
                    </p>
                  </div>
                </div>

                {/* Right: Status / Action */}
                <div className="flex items-center gap-3">
                  {apt.isCompleted ? (
                    // ✅ Completed
                    <span className="flex items-center gap-1 text-green-600 text-xs font-semibold bg-green-50 px-3 py-1 rounded-full">
                      <img
                        src={assets.tick_icon}
                        alt="Completed"
                        className="w-3 h-3"
                      />
                      Completed
                    </span>
                  ) : apt.cancelled ? (
                    // ❌ Cancelled
                    <span className="text-red-600 text-xs font-semibold bg-red-50 px-3 py-1 rounded-full">
                      Cancelled
                    </span>
                  ) : (
                    // 🔘 Cancel Button
                    <button
                      onClick={() => handleCancel(apt._id)}
                      className="hover:opacity-80 transition"
                      title="Cancel Appointment"
                    >
                      <img
                        src={assets.cancel_icon}
                        alt="Cancel"
                        className="w-6 h-6"
                      />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              No recent appointments found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
