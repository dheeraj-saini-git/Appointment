import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Home from './pages/Home' ;
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import Contact from './pages/Contact';
import About from './pages/About';
import MyAppointments from './pages/MyAppointments';
import MyProfile from './pages/MyProfile';
import Appointment from './pages/Appointments';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';

export default function App(){
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <NavBar />
     <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/doctors' element={<Doctors />}/>
      <Route path='/doctors/:speciality' element={<Doctors />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/about' element={<About />}/>
      <Route path='/contact' element={<Contact />}/>
      <Route path='/my-profile' element={<MyProfile />}/>
      <Route path='/my-appointments' element={<MyAppointments />}/>
      <Route path='/appointment/:docId' element={<Appointment />}/>
     </Routes>
     <Footer />
    </div>

  )
}