import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom';

const RelatedDoctors = ({ docId, speciality }) => {
  const { doctors } = useContext(AppContext);
  const [relDoc, setRelDocs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const filtered = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      );
      setRelDocs(filtered);
    }
  }, [doctors, docId, speciality]);

  return (
    <div className='py-16 px-4 md:px-10 lg:px-20 bg-white text-gray-800'>
      <div className='text-center mb-12'>
        <h1 className='text-3xl md:text-4xl font-semibold'>Related Doctors</h1>
        <p className='text-gray-500 text-sm md:text-base mt-2'>
          Simply browse through our extensive list of trusted doctors.
        </p>
      </div>

      {/* Doctor Cards */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
        {relDoc.length > 0 ? (
          relDoc.map((item, index) => (
            <div
              onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0,0) }}
              key={index}
              className='bg-[#F4F6FF] rounded-xl border border-gray-200 p-4 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 cursor-pointer'
            >
              <img
                src={item.image}
                alt={item.name}
                className='w-full h-40 object-contain rounded-lg mb-4 transition-all duration-300'
              />
              <p className='text-green-600 text-sm font-medium mb-1'>● Available</p>
              <p className='text-base font-semibold'>{item.name}</p>
              <p className='text-sm text-gray-500'>{item.speciality}</p>
            </div>
          ))
        ) : (
          <p className='col-span-full text-center text-gray-500'>
            No related doctors found.
          </p>
        )}
      </div>
    </div>
  )
}

export default RelatedDoctors
