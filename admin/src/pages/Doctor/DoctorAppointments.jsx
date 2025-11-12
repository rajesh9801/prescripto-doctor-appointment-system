import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorAppointments = () => {
    const { dToken, getAppointments, appointments, completeAppointment, cancelAppointment } = useContext(DoctorContext);
    const { calculateAge, formatDate, currency } = useContext(AppContext);

    useEffect(() => {
        if (dToken) {
            getAppointments();
        }
    }, [dToken]);

    return (
        <div className="w-full max-w-6xl mx-auto mt-6 px-4">
            {/* Title */}
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                All Appointments
            </h2>

            {/* Container */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm text-sm max-h-[80vh] min-h-[50vh] overflow-x-auto">
                {/* Header */}
                <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] gap-2 py-3 px-6 border-b bg-gray-50 text-gray-600 font-medium">
                    <p>#</p>
                    <p>Patient</p>
                    <p>Payment</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Fees</p>
                    <p>Action</p>
                </div>

                {/* Data rows */}
                <div>
                    {appointments.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">
                            No appointments found.
                        </p>
                    ) : (
                        appointments.map((item, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] gap-2 items-center py-4 px-6 border-b hover:bg-gray-50 transition-colors"
                            >
                                <p className="text-gray-700">{index + 1}</p>

                                {/* Patient Info */}
                                <div className="flex items-center gap-3">
                                    <img
                                        src={item.userData.image || assets.user_icon}
                                        alt="patient"
                                        className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                                    />
                                    <p className="font-medium text-gray-800">
                                        {item.userData.name}
                                    </p>
                                </div>

                                {/* Payment */}
                                <p
                                    className={`font-medium ${item.payment ? "text-green-600" : "text-yellow-600"
                                        }`}
                                >
                                    {item.payment ? "Online" : "Cash"}
                                </p>

                                {/* Age */}
                                <p className="text-gray-700">
                                    {calculateAge(item.userData.dob)} yrs
                                </p>

                                {/* Date & Time */}
                                <p className="text-gray-700">
                                    {formatDate(item.slotDate)}, {item.slotTime}
                                </p>

                                {/* Fees */}
                                <p className="font-semibold text-gray-800">
                                    {currency}
                                    {item.amount}
                                </p>

                                {/* Actions */}
                                {
                                    item.cancelled ? <p className="text-red-400 text-xs font-medium">Cancelled</p>
                                        : item.isCompleted ? <p className="text-green-500 text-xs font-medium">Completed</p> :
                                            <div className="flex gap-3 justify-start sm:justify-center">
                                                <button className="p-1.5 bg-red-100 hover:bg-red-200 rounded-full transition">
                                                    <img
                                                        src={assets.cancel_icon}
                                                        alt="Cancel"
                                                        className="w-5 h-5"
                                                        onClick={() => cancelAppointment(item._id)}
                                                    />
                                                </button>
                                                <button className="p-1.5 bg-green-100 hover:bg-green-200 rounded-full transition" >
                                                    <img

                                                        src={assets.tick_icon}
                                                        alt="Approve"
                                                        className="w-5 h-5"
                                                        onClick={() => completeAppointment(item._id)}
                                                    />
                                                </button>
                                            </div>
                                }
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorAppointments;
