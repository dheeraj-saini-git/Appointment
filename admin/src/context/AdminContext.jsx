import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

export default function AdminContextProvider(props) {
  const [aToken, setAToken] = useState(
  localStorage.getItem("aToken") ? localStorage.getItem("aToken") : localStorage.getItem("dToken")
);

  const backendUrl = "https://appointment-4op9.onrender.com/";
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false)


  async function getAllDoctors() {
    try {
      const { data } = await axios.post(
        backendUrl + "api/admin/all-doctors",
        {},
        { headers: { aToken } }
      );

      if (data.success) {
        console.log(data);
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function changeAvailability(docId) {
    try {
      const { data } = await axios.post(
        backendUrl + "api/admin/change-availability",
        { docId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function getAllAppointments() {
    try {
      const { data } = await axios.post(
        backendUrl + "api/admin/appointments",
        {},
        { headers: { aToken } }
      );
      if (data.success) {
        setAppointments(data.appointments);
        console.log(appointments)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

    const cancelAppointment = async (appointmentId)=>{
        try {
            const { data } = await axios.post(backendUrl+'api/admin/cancel-appointment', {appointmentId}, { headers: { aToken }})
            if(data.success){
                toast.success(data.message)
                getAllAppointments()
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const getDashData = async ()=>{
      try {

        const { data } = await axios.get(backendUrl+'api/admin/dashboard', { headers: { aToken }})
         if(data.success){
              setDashData(data.dashData)
              console.log(data.dashData)
            }else{
              toast.error(data.message)
            }
      } catch (error) {
        toast.error(error.message)
      }
    }



  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashData, getDashData,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
}
