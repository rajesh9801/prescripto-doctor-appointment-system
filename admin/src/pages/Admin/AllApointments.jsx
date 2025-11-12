import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const {
    aToken,
    appointments,
    getAllAppointments,
    cancelAppointment,
  } = useContext(AdminContext);

  const { calculateAge, formatDate, currency } = useContext(AppContext);

  // ✅ Fetch all appointments once token is available
  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      {/* Page Title */}
      <p className="mb-3 text-lg font-semibold text-gray-800">
        All Appointments
      </p>

      {/* Table Container */}
      <div className="bg-white border rounded-lg text-sm max-h-[80vh] min-h-[60vh] overflow-y-auto shadow-sm">
        {/* Header */}
        <div className="sticky top-0 bg-gray-100 text-gray-600 font-medium grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b z-10">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p className="text-center">Status / Action</p>
        </div>

        {/* Data Rows */}
        <div className="divide-y">
          {appointments && appointments.length > 0 ? (
            [...appointments].reverse().map((item, index) => (
              <div
                key={index}
                className={`flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center py-3 px-6 border-b transition ${
                  item.cancelled || item.isCompleted
                    ? "bg-gray-50 text-gray-400"
                    : "hover:bg-gray-50 text-gray-600"
                }`}
              >
                {/* Index */}
                <p className="max-sm:hidden">{index + 1}</p>

                {/* Patient Info */}
                <div className="flex items-center gap-2">
                  <img
                    className="w-8 h-8 rounded-full border object-cover"
                    src={item.userData?.image || assets.user_icon}
                    alt="Patient"
                  />
                  <p className="font-medium text-gray-800">
                    {item.userData?.name || "Unknown"}
                  </p>
                </div>

                {/* Age */}
                <p className="max-sm:hidden text-gray-700">
                  {item.userData?.dob
                    ? calculateAge(item.userData.dob)
                    : "--"}
                </p>

                {/* Date & Time */}
                <p className="text-gray-700">
                  {formatDate(item.slotDate)}, {item.slotTime}
                </p>

                {/* Doctor Info */}
                <div className="flex items-center gap-2">
                  <img
                    className="w-8 h-8 rounded-full border object-cover"
                    src={item.docData?.image || assets.doctor_icon}
                    alt="Doctor"
                  />
                  <p className="font-medium text-gray-800">
                    {item.docData?.name || "Doctor"}
                  </p>
                </div>

                {/* Fees */}
                <p className="font-semibold text-gray-800">
                  {currency}
                  {item.docData?.fees || 0}
                </p>

                {/* Status / Action */}
                <div className="flex justify-center items-center">
                  {item.isCompleted ? (
                    // ✅ Completed (priority)
                    <span className="flex items-center gap-1 text-green-600 text-xs font-semibold bg-green-50 px-3 py-1 rounded-full">
                      <img
                        src={assets.tick_icon}
                        alt="Completed"
                        className="w-3 h-3"
                      />
                      Completed
                    </span>
                  ) : item.cancelled ? (
                    // ✅ Cancelled
                    <span className="text-red-600 text-xs font-semibold bg-red-50 px-3 py-1 rounded-full">
                      Cancelled
                    </span>
                  ) : (
                    // ✅ Show Cancel Button (only for pending)
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="hover:opacity-80 transition"
                      title="Cancel Appointment"
                    >
                      <img
                        src={assets.cancel_icon}
                        alt="Cancel Appointment"
                        className="w-6 h-6"
                      />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-[50vh] text-gray-500 font-medium">
              No Appointments Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllAppointments;
