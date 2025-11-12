import React, { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
    const [state, setState] = useState('Admin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { setAToken, backendUrl } = useContext(AdminContext)
    const { setDToken } = useContext(DoctorContext)

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            if (state === 'Admin') {
                const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
                    email,
                    password,
                })

                if (data.success) {
                    localStorage.setItem('aToken', data.token)
                    setAToken(data.token)
                    toast.success('Admin login successful!')
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(`${backendUrl}/api/doctor/login`, {
                    email, 
                    password,
                })

                if (data.success) {
                    localStorage.setItem('dToken', data.token)
                    setDToken(data.token)
                    toast.success('Doctor login successful!')
                    console.log(data.token)
                } else {
                    toast.error(data.message)
                }
            } 
        } catch (err) {
            const message = err.response?.data?.message || "Login failed. Please try again."
            console.error("Login error:", message)
            toast.error(message)
        }
    }

    const toggleState = () => {
        setState(state === 'Admin' ? 'Doctor' : 'Admin')
    }

    return (
        <form
            onSubmit={onSubmitHandler}
            className="min-h-[80vh] flex flex-col justify-center items-center bg-gray-100 p-8 rounded-lg shadow-md max-w-md mx-auto"
        >
            <div className="mb-6 text-center">
                <p className="text-3xl font-bold text-gray-800">
                    <span className="text-blue-500">{state}</span> Login
                </p>
            </div>

            <div className="w-full mb-4">
                <label className="block mb-2 text-gray-700 font-semibold">Email</label>
                <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </div>

            <div className="w-full mb-6">
                <label className="block mb-2 text-gray-700 font-semibold">Password</label>
                <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors font-semibold mb-4"
            >
                Login
            </button>

            <p className="text-gray-700">
                {state === 'Admin' ? 'Doctor Login?' : 'Admin Login?'}{' '}
                <span
                    onClick={toggleState}
                    className="text-blue-500 font-semibold cursor-pointer hover:underline"
                >
                    Click here
                </span>
            </p>
        </form>
    )
}

export default Login
