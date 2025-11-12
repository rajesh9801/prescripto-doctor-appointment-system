import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null); // lowercase setter

  // Load token from localStorage once
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  // Fetch doctors list
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/all-doctors-list`);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message || "Failed to load doctors");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching doctors");
    }
  };

  // Fetch logged-in user data
  const getUserData = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) return;
      const { data } = await axios.get(`${backendUrl}/api/user/my-profile`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (data.success) {
        setUser(data.userData);      
      } else {
        toast.error(data.message || "Failed to fetch user data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching user data");
    }
  };

  useEffect(() => {
    getAllDoctors();
    getUserData();
  }, []); // Run only once on mount

  const currencySymbol = "$";

  // ✅ Include user in context
  const value = { 
    doctors, setDoctors, getAllDoctors,
    currencySymbol, backendUrl, 
    token, setToken,
    user, setUser // <--- Add user
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
