import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const Available = ({ id }) => {
    const { doctors } = useContext(AppContext);

    // ✅ Find the doctor by id
    const doctor = doctors.find((doc) => doc._id === id);

    // ✅ If no doctor found, return null (avoids errors)
    if (!doctor) return null;

    return (
        <div
            className={`px-3 py-1 rounded-full w-fit ${
                doctor.available
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
            }`}
        >
            {doctor.available ? "Available" : "Unavailable"}
        </div>
    );
}

export default Available
