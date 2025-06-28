import { useState, createContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const DoctorContext = createContext();

export default function DoctorContextProvider(props) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false)
  const [profileData, setProfileData] = useState(false)

  const getAppointment = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "api/doctor/appointment-list",
        {
          headers: { dToken },
        }
      );

      if (data.success) {
        setAppointments([...data.appointments]);
        console.log(data.appointments);
      } else {
        toast.error(data.message);
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "api/doctor/complete-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointment();
      } else {
        toast.error(data.message);
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "api/doctor/cancel-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointment();
      } else {
        toast.error(data.message);
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const getDashData = async ()=>{
    try {
      const {data} = await axios.get(backendUrl+'api/doctor/dashboard', {headers: {dToken}})
      if (data.success) {
        setDashData(data.dashData)
        console.log(data.dashData)
        
      } else {
        toast.error(data.message);
        console.log(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  }

  const getProfileData = async ()=>{
     try {
      const {data} = await axios.get(backendUrl+'api/doctor/profile', {headers: {dToken}})
      if (data.success) {
        setProfileData(data.profileData)
        console.log(data.profileData)
        
      } else {
        toast.error(data.message);
        console.log(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  }
  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments, getAppointment,
    completeAppointment, cancelAppointment,
    dashData, setDashData, getDashData,
    profileData, setProfileData, getProfileData
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
}
