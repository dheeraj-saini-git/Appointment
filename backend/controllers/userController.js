import validator from "validator";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import Razorpay from "razorpay";


// api to register user

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !password || !email) {
      return res.json({ success: false, message: "Missing Details" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Passwords must be strong" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Missing Details" });
    }

    let data = await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      dob,
      gender,
      address: JSON.parse(address),
    },
    { new : true }
  );

    if (imageFile) {
      console.log("Uploading image...");
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;
      data = await userModel.findByIdAndUpdate(userId, { image: imageURL }, { new : true });
      console.log("Image uploaded:", imageURL);
    }
    return res.json({ success: true, message: "Profile updated ", data } );

  } catch (error) {
    console.error("Update profile error:", error);
    res.json({ success: false, message: "Server error", error: error.message });
  }
};

// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    // Step 1: Get doctor data
    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    // Step 2: Initialize or update slot_booked
   let slot_booked = docData.slot_Booked || {};

    if (!slot_booked[slotDate]) {
      slot_booked[slotDate] = [];
    }

    if (slot_booked[slotDate].includes(slotTime)) {
      return res.json({ success: false, message: "Slot already booked" });
    }

    // Step 3: Add the new slot
    slot_booked[slotDate].push(slotTime);

    // Step 4: Create appointment
    const userData = await userModel.findById(userId).select("-password");

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();
    
    // Step 5: Update doctor document with new slot_booked
     await doctorModel.findByIdAndUpdate(
      docId,
     { slot_Booked : slot_booked } ,
    
    );

    return res.json({ success: true, message: "Appointment Booked!" });
  } catch (error) {
    console.error("Booking error:", error);
    return res.json({ success: false, message: error.message });
  }
};


const listAppointment = async(req, res)=>{
  try{
    const { userId } = req.body
    const appointments = await appointmentModel.find({userId})
    return res.json({ success : true, appointments})

  }catch(error){
    console.log(error)
    return res.json({ success : false, message: error.message})
  }
}
 
const cancelAppointment = async (req, res)=>{

  const { userId, appointmentId }= req.body
  try {
    const appointmentData = await appointmentModel.findById(appointmentId)

    //verify appointment user
    if(appointmentData.userId !== userId){
      return res.json({ success : false, message: 'Unauthorized action'})
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled : true})
    const { docId, slotDate, slotTime } = appointmentData

    const docData = await doctorModel.findById(docId)
    

    let slot_Booked = docData.slot_Booked
    slot_Booked[slotDate] = slot_Booked[slotDate].filter( e => e !== slotTime)

    await doctorModel.findByIdAndUpdate(docId, {slot_Booked})

    res.json({ success: true, message: 'Appointment has been cancelled'})
  
  } catch (error) {
    console.log(error.message)
    return res.json({ success : false, message: error.message})
  }
}
 
const razorpayInstance = new Razorpay({
  key_id : process.env.RAZORPAY_KEY_ID,
  key_secret : process.env.RAZORPAY_KEY_SECRET,
})

// API to make payment of appointment using razorpay 

const paymentRazorPay = async (req,res)=>{

  try {
    const { appointmentId } = req.body
    console.log(appointmentId)
    const appointmentData = await appointmentModel.findById(appointmentId)

    if(!appointmentData || appointmentData.cancelled){
      return res.json( { success: false, message: 'Appointment cancelled or not found'})
    }

    // creating options for raorpay payment 
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    }
    // creation of an order
    const order = await razorpayInstance.orders.create(options)

    res.json({ success: true, order})

  } catch (error) {
     console.log(error)
     res.json({ success: false, message: error.message })
  }
    
}

//APi to verify razorpay payment

const verifyRazorpay = async (req, res)=>{
  try {
    const { razorpay_order_id } = req.body
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
    console.log(orderInfo)

    if(orderInfo.status === 'paid'){
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
      res.json({ success: true, message: "Payment successful"})
    }else{
    res.json({ success: false, message: "Payment failed"})
    }

  } catch (error) {
    res.json({ success: false, message: error.message})
  }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorPay, verifyRazorpay };
