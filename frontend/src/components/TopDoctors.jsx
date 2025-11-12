import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Available from './Availabe'
// import { doctors } from '../assets/assets'

const TopDoctors = () => {

    const navigate = useNavigate()
    const {doctors} = useContext(AppContext)

  return (
    <div className='py-16 px-4 md:px-10 lg:px-20 bg-white text-gray-800'>
      <div className='text-center mb-12'>
        <h1 className='text-3xl md:text-4xl font-semibold'>Top Doctors to Book</h1>
        <p className='text-gray-500 text-sm md:text-base mt-2'>
          Simply browse through our extensive list of trusted doctors.
        </p>
      </div>

      {/* Doctor Cards */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
        {doctors.slice(0, 10).map((item, index) => (
          <div 
            onClick={()=>{navigate(`/appointment/${item._id}`); scrollTo(0,0)}}
            key={index}
            className='bg-[#F4F6FF] rounded-xl border border-gray-200 p-4 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 cursor-pointer'
          >
            <img
              src={item.image}
              alt={item.name}
              className='w-full h-40 bg-primary object-contain rounded-lg mb-4 transition-all duration-300'
            />
            <Available id={item._id} />
            <p className='text-base font-semibold'>{item.name}</p>
            <p className='text-sm text-gray-500'>{item.speciality}</p>
          </div>
        ))}
      </div>

      {/* More Button */}
      <div className='text-center mt-12'>
        <button onClick={()=> {navigate('/doctors'); scrollTo(0,0)}} className='bg-[#F4F6FF] text-gray-700 px-6 py-2 rounded-full hover:bg-[#e4e7fb] transition-all duration-300 text-sm shadow-sm cursor-pointer'>
          more
        </button>
      </div>
    </div>
  )
}

export default TopDoctors
