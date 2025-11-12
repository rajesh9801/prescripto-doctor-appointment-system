import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Available from '../components/Availabe'

const Doctors = () => {
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)
  const [showSpecialist, setShowSpecialist] = useState(false)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div>
      <p className="text-gray-600">Browse through the doctors specialist.</p>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        {/* Mobile Filter Button */}
        <button
          className="md:hidden px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
          onClick={() => setShowSpecialist((prev) => !prev)}
        >
          {showSpecialist ? "Close Filters" : "Filter"}
        </button>

        {/* Specialist Filter List */}
        <div
          className={`flex-col gap-3 text-sm text-gray-600 transition-all ${
            showSpecialist ? 'flex' : 'hidden sm:flex'
          }`}
        >
          {[
            'General physician',
            'Gynecologist',
            'Dermatologist',
            'Pediatricians',
            'Neurologist',
            'Gastroenterologist',
          ].map((spec) => (
            <p
              key={spec}
              onClick={() =>
                speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)
              }
              className={`px-4 py-2 border border-gray-300 rounded-md cursor-pointer transition ${
                speciality === spec ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'
              }`}
            >
              {spec}
            </p>
          ))}
        </div>

        {/* Doctor Cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6">
          {filterDoc.map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              key={index}
              className="bg-[#F4F6FF] rounded-xl border border-gray-200 p-4 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full bg-primary h-40 object-contain rounded-lg mb-4 transition-all duration-300"
              />
              <Available id={item._id} />
              <p className="text-base font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">{item.speciality}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Doctors
