import React, { useContext, useEffect } from "react";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import {toast} from "react-toastify";

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, setDoctors ,backendUrl} = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  const changeHandler = async (docId) => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/admin/toggle-availability/${docId}`,
        {},
        { headers: { Authorization: `Bearer ${aToken}` } }
      );

      if (data.success) {
        toast.success(data.message);

        // ✅ Update state without reloading
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
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-8">
      {/* Page Heading */}
      <h1 className="text-2xl font-bold text-gray-800 mb-8 pb-2">
        All Doctors
      </h1>

      {/* Doctors Grid */}
      <div className="flex flex-wrap gap-8 justify-center">
        {doctors.map((items, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-2xl p-6 w-72 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative"
          >
            {/* Availability Badge */}
            <button
              className={`absolute top-4 right-4 px-3 py-1 text-xs font-medium rounded-full hover:cursor-pointer ${
                items.available
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
              onClick={() => changeHandler(items._id)}
            >
              {items.available ? "Available" : "Unavailable"}
            </button>

            {/* Doctor Image */}
            <div className="flex justify-center">
              <img
                src={items.image}
                alt={items.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-md"
              />
            </div>

            {/* Doctor Info */}
            <div className="text-center mt-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {items.name}
              </h2>
              <p className="text-sm text-blue-600 font-medium">
                {items.speciality}
              </p>
              <p className="text-sm text-gray-500">{items.degree}</p>
            </div>

            {/* Fees & Experience */}
            <div className="mt-4 flex justify-between text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              <span className="font-medium">₹{items.fees}</span>
              <span>{items.experience}</span>
            </div>

            {/* About */}
            <p className="text-sm text-gray-500 mt-3 line-clamp-2 text-center">
              {items.about}
            </p>

            {/* Action Button */}
            <button className="mt-5 w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
