import React, { useContext, useEffect, useState } from 'react'
import axios from "axios";
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')   // ✅ Added error state
  const navigate = useNavigate();
  const { token, setToken, backendUrl } = useContext(AppContext)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // clear old errors

    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/signup", {
          name,
          email,
          password,
        });

        console.log("User registered:", data);
        alert("Account created successfully! Please login.");
        setState("Login");
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });

        console.log("User logged in:", data);
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success('login successfully')
        
      }
    } catch (err) {
      console.log(err);
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
      setError(message);
    }
  };

  useEffect(()=>{
    if(token){
       navigate('/')
    } 
  },[token])

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-md rounded-lg p-8 flex flex-col gap-6"
      >
        {/* Heading */}
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-800">
            {state === 'Sign Up' ? 'Create Account' : 'Login'}
          </p>
          <p className="text-gray-500 text-sm">
            {state === 'Sign Up'
              ? 'Please sign up to book an appointment'
              : 'Please login to book an appointment'}
          </p>
        </div>

        {/* Show error if exists */}
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {/* Full Name (only in Sign Up) */}
        {state === 'Sign Up' && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={name}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={email}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            value={password}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition"
        >
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        {/* Switch between Login / Sign Up */}
        <p className="text-center text-sm text-gray-600">
          {state === 'Sign Up'
            ? 'Already have an account? '
            : "Don't have an account? "}
          <span
            className="text-primary font-medium cursor-pointer hover:underline"
            onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
          >
            {state === 'Sign Up' ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </form>
    </div>
  )
}

export default Login
