import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
    return (
        <div className='flex flex-col items-center gap-4 py-16 text-gray-800 px-4 md:px-10 lg:px-20 bg-gray-50' id='speciality'>
            <h1 className='text-3xl md:text-4xl font-semibold text-center'>Find by Speciality</h1>
            <p className='text-center text-sm md:text-base text-gray-600 max-w-2xl'>
                Simply browse through our extensive list of trusted doctors,<br className='hidden sm:block' />
                schedule your appointment hassle-free.
            </p>

            <div className='flex gap-6 mt-10 overflow-scroll w-full '>
                {specialityData.map((item, index) => (
                    <Link 
                        onClick={()=>scrollTo(0,0)}
                        key={index} 
                        to={`/doctors/${item.speciality}`} 
                        className='flex-shrink-0 w-36 flex flex-col items-center bg-white rounded-xl shadow-md p-4 hover:scale-105 hover:shadow-lg transition-all duration-300'
                    >
                        <img 
                            src={item.image} 
                            alt={item.speciality} 
                            className='w-16 h-16 object-contain mb-3' 
                        />
                        <p className='text-sm md:text-base font-medium text-center'>{item.speciality}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SpecialityMenu
   