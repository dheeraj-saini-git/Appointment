import { createContext, useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export default function AppContextProvider(props) {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false)

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token")
      ? localStorage.getItem("token")
      : ""
  );
  const [userData, setUserData] = useState(false);

  const getDoctorsData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(backendUrl + "api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false)
  };
  const loadUserProfileData = async (req, res) => {
    try {
      const { data } = await axios.post(backendUrl + "api/user/get-profile", {}, {
        headers: { 
         token
         },
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, [token]);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  },[token]);

  const value = {
    doctors,
    loading,
    getDoctorsData,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    setDoctors,
    userData,
    setUserData,
    loadUserProfileData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}
