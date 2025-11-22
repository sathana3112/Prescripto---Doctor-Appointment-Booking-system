import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import razorpay from 'razorpay'

// API to register user

const registerUser = async (req, res) => {

  try {

    const { name, email, password } = req.body
    if (!name || !password || !email) {
      return res.json({ success: false, message: "Missing Details" })

    }

    //validating email format

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "enter a valid email" })

    }
    //validating strong password

    if (password.length < 8) {
      return res.json({ success: false, message: "enter a strong password" })

    }

    // hashing user password

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const userData = {
      name,
      email,
      password: hashedPassword
    }

    const newUser = new userModel(userData)
    const user = await newUser.save()
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.json({ success: true, token })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }

}

// API for user login

const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.json({ success: false, message: 'User does not exist' })

    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
      const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET)
      res.json({ success: true, token })

    } else {
      res.json({ success: false, message: "Invalid credentials" })
    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })

  }

}

// API to get user profile data

const getProfile = async (req, res) => {

  try {

    const userId  = req.userId;
    const userData = await userModel.findById(userId).select('-password')
    res.json({ success: true, userData })

  } catch (error) {

    console.log(error)

    res.json({ success: false, message: error.message })

  }

}

//API to update user profile

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, address, dob, gender } = req.body
    const imageFile = req.file
    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" })
    }
    await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })
    if (imageFile) {

      //upload image to cloudinarys

      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
      const imageURL = imageUpload.secure_url
      await userModel.findByIdAndUpdate(userId, { image: imageURL })
    }
    res.json({ success: true, message: "Profile Updated" })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })

  }
}

// API to book appointment
const bookAppointment = async (req, res) => {

  try {
    const { docId, slotDate, slotTime } = req.body
    const userId = req.userId
    const docData = await doctorModel.findById(docId).select("-password")

    if (!docData.available) {

      return res.json({ success: false, message: 'Doctor Not Available' })

    }
    let slots_booked = docData.slots_booked

    // checking for slot availablity 

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: 'Slot Not Available' })
      }

      else {
        slots_booked[slotDate].push(slotTime)
      }

    } else {

      slots_booked[slotDate] = []
      slots_booked[slotDate].push(slotTime)

    }

    const userData = await userModel.findById(userId).select("-password")
    delete docData.slots_booked

    const appointmentData = {

      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now()

    }

    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()
    // save new slots data in docData

    await doctorModel.findByIdAndUpdate(docId, { slots_booked })
    res.json({ success: true, message: 'Appointment Booked' })


  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })

  }

}

// API to cancel appointment

const cancelAppointment = async (req, res) => {
  try {
    // accept id from body or URL param
    const appointmentId = req.body.appointmentId || req.params.id;
    const userId = req.userId; // set by your authUser middleware

    console.log('[cancelAppointment] appointmentId:', appointmentId, 'req.userId:', userId);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: missing user id' });
    }
    if (!appointmentId) {
      return res.status(400).json({ success: false, message: 'Bad request: appointmentId required' });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    console.log('[cancelAppointment] appointment.userId (raw):', appointment.userId);

    // normalize both sides to strings before comparing
    const appointmentOwnerId = appointment.userId && appointment.userId.toString
      ? appointment.userId.toString()
      : String(appointment.userId);

    if (appointmentOwnerId !== String(userId)) {
      console.log('[cancelAppointment] unauthorized - owner:', appointmentOwnerId, 'requester:', String(userId));
      return res.status(403).json({ success: false, message: 'Unauthorized action' });
    }

    // If you store the slot time on appointment (e.g. slotTime), remove it from doctor's slots_booked
    const doctor = await doctorModel.findById(appointment.doctorId);
    if (doctor && Array.isArray(doctor.slots_booked)) {
      // adjust these field names if yours differ (slotTime / slots_booked)
      doctor.slots_booked = doctor.slots_booked.filter(s => s.slotTime !== appointment.slotTime);
      await doctor.save();
      console.log('[cancelAppointment] removed slot from doctor:', appointment.slotTime);
    }

    appointment.cancelled = true;
    await appointment.save();

    return res.json({ success: true, message: 'Appointment cancelled' });
  } catch (error) {
    console.error('[cancelAppointment] error:', error);
    return res.status(500).json({ success: false, message: 'Something went wrong', error: error.message });
  }
};


// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
    try {

      const { appointmentId } = req.body
      const razorpayInstance = new razorpay({ key_id : process.env.RAZORPAY_KEY_ID, key_secret : process.env.RAZORPAY_KEY_SECRET})
        
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)
        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {

        const  userId  = req.userId
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay };