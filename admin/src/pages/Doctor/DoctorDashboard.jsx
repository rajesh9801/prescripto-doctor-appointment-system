import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorDashboard = () => {
  const { dToken, getDashData, dashData } = useContext(DoctorContext);
  const { currency, formatDate } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  if (!dashData) return null;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 mt-6">
      {/* Page Title */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Doctor Dashboard
      </h2>

      {/* === Summary Cards === */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {/* Earnings Card */}
        <div className="flex items-center gap-4 bg-white border border-gray-100 shadow-sm rounded-2xl p-5 hover:shadow-md transition">
          <div className="bg-green-50 p-4 rounded-xl">
            <img
              src={assets.earning_icon}
              alt="Earnings"
              className="w-10 h-10"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {currency}
              {dashData.earning}
            </h3>
            <p className="text-gray-500 text-sm mt-1">Earnings</p>
          </div>
        </div>

        {/* Appointments Card */}
        <div className="flex items-center gap-4 bg-white border border-gray-100 shadow-sm rounded-2xl p-5 hover:shadow-md transition">
          <div className="bg-blue-50 p-4 rounded-xl">
            <img
              src={assets.appointments_icon}
              alt="Appointments"
              className="w-10 h-10"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {dashData.appointments}
            </h3>
            <p className="text-gray-500 text-sm mt-1">Appointments</p>
          </div>
        </div>

        {/* Patients Card */}
        <div className="flex items-center gap-4 bg-white border border-gray-100 shadow-sm rounded-2xl p-5 hover:shadow-md transition">
          <div className="bg-purple-50 p-4 rounded-xl">
            <img
              src={assets.patients_icon}
              alt="Patients"
              className="w-10 h-10"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {dashData.patients}
            </h3>
            <p className="text-gray-500 text-sm mt-1">Patients</p>
          </div>
        </div>
      </div>

      {/* === Latest Appointments Table === */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-x-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 rounded-t-2xl">
          <h3 className="text-lg font-semibold text-gray-800">
            Latest Appointments
          </h3>
        </div>

        {dashData.latestAppointments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No recent appointments found.
          </p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="py-3 px-6 text-left">#</th>
                <th className="py-3 px-6 text-left">Patient</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Time</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {dashData.latestAppointments.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-6">{index + 1}</td>
                  <td className="py-3 px-6 flex items-center gap-3">
                    <img
                      src={item.userData?.image || assets.people_icon}
                      alt="patient"
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                    <span className="font-medium text-gray-800">
                      {item.userData?.name || "Unknown"}
                    </span>
                  </td>
                  <td className="py-3 px-6">{formatDate(item.slotDate)}</td>
                  <td className="py-3 px-6">{item.slotTime}</td>
                  <td className="py-3 px-6">
                    {item.cancelled ? (
                      <span className="text-red-600 font-medium">Cancelled</span>
                    ) : item.isCompleted ? (
                      <span className="text-green-600 font-medium">Completed</span>
                    ) : (
                      <span className="text-yellow-600 font-medium">Pending</span>
                    )}
                  </td>
                  <td className="py-3 px-6 font-semibold">
                    {currency}
                    {item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
