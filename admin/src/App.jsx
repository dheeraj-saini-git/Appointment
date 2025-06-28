import React, {useContext, useEffect} from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AdminContext } from './context/AdminContext'
import NavBar from './components/NavBar'
import SideBar from './components/SideBar'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Admin/Dashboard'
import AllAppointments from './pages/Admin/AllAppointments'
import AddDoctor from './pages/Admin/AddDoctor'
import DoctorList from './pages/Admin/DoctorList'
import { DoctorContext } from './context/DoctorContext'
import DoctorAppointments from './pages/Doctor/DoctorAppointments'
import DoctorDashboard from './pages/Doctor/DoctorDashboard'
import DoctorProfile from './pages/Doctor/DoctorProfile'


export default function App(){
  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)

  useEffect(() => {
  if (localStorage.getItem("aToken") && localStorage.getItem("dToken")) {
    localStorage.removeItem("aToken");
    localStorage.removeItem("dToken");
    window.location.reload(); // Or navigate to login
  }
}, []);
  
  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <NavBar />
      <div className='flex items-start'>
      <SideBar />
      <Routes>
        <Route path='/' element={<></>} />
        <Route path='/admin-dashboard' element={<Dashboard />} />
        <Route path='/all-appointments' element={<AllAppointments />} />
        <Route path='/add-doctor' element={<AddDoctor />} />
        <Route path='/doctor-list' element={<DoctorList />} />

        {/* Doctor Route */}
        <Route path='/doctor-appointments' element={<DoctorAppointments />}> </Route>
        <Route path='/doctor-dashboard' element={<DoctorDashboard/>}> </Route>
        <Route path='/doctor-profile' element={<DoctorProfile />}></Route>
      </Routes>
      </div>
    </div>
  ) : (
     <div>
      <Login />
      <ToastContainer />
    </div>
  )

} 