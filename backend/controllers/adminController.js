import validator from 'validator'
import bcrypt from 'bcryptjs'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'

// API for adding doctor

const addDoctor = async (req,res) => {
    try{
        console.log(req.body)
        const {name, email, password, speciality, degree, experience, about, fees, address} = req.body
        const imageFile = req.file 
    
        //checking for all data to add doctor 

        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address ){
            return res.json({success : false, message: 'missing details'})
        }
        if( !validator.isEmail(email)){
            return res.json({success : false, message:'Please enter a valid email'})
        }
        if(password.length < 8){
            return res.json({success : false, message:'Please enter a strong password'})
        }
        // hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type : 'image'})
        const imageURL = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image : imageURL,
            password : hashedPassword,
            speciality,
            degree,
            experience, 
            about,
            fees,
            address : JSON.parse(address),
            date : Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        res.json({success: true, message: 'Doctor Added'})

    } catch(error){
        console.log(error)
        res.json({success:false, message: error.message})
    }

}

// API for admin login 
const loginAdmin = async (req,res)=>{
    try{
        const {email, password} = req.body
        if(email === process.env.ADMIN_EMAIL && password == process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true, token})
        }else {
            res.json({success: false, message: error.message})
        }
    }catch(error){
        res.json({success:false, message: error.message})
    }
}

 // API to get all doctors list for admin panel
 const allDoctors = async (req,res)=>{
    try{
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success : true, doctors})

    }catch(error){
        console.log(error)
        res.json({success:false, message: error.message})
    }
 }

 // API to get all appointment list 

 const allAppointments = async (req, res)=>{
    try{
        const appointments = await appointmentModel.find({})
        res.json({success : true, appointments}) 
    }catch(error){
        console.log(error)
        res.json({success:false, message: error.message})
    }
 }

 const cancelAppointment = async (req,res)=>{
    try {
    const { appointmentId } = req.body
    
    const appointmentData = await appointmentModel.findById(appointmentId)
    
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled : true })

    const { docId, slotDate, slotTime } = appointmentData

    const docData = await doctorModel.findById(docId)

    let slot_Booked = docData.slot_Booked

    slot_Booked[slotDate] = slot_Booked[slotDate].filter( e => e !== slotTime)

    await doctorModel.findByIdAndUpdate(docId, {slot_Booked})
    res.json({ success: true, message: 'Appointment has been cancelled'})

    } catch (error) {
        console.log(error.message)
        res.json({ success : false, message: error.message})
    }
    
}
// Api to get dashboard data for admin panel

const adminDashboard = async (req, res)=>{
    try {
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors : doctors.length,
            patients: users.length,
            appointments: appointments.length,
            latestAppointments : appointments.reverse().slice(0,5)
        }
     res.json({ success: true, dashData })

    } catch (error) {
        console.log(error.message)
        res.json({ success : false, message: error.message})
    }
}


export {addDoctor, loginAdmin, allDoctors, allAppointments, cancelAppointment, adminDashboard}