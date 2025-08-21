import express from 'express'
import cors from 'cors'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import 'dotenv/config'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

//app config
const app = express()
const port = process.env.PORT || 4000
connectCloudinary()

//middlewares

app.use(express.json())
app.use(cors({
  origin: ['https://appointment-frontend-fawn.vercel.app', 'https://appointment-admin-mu.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.options("*", cors())

connectDB()

//api endpoints 
// localhost:4000/api/admin/add-doctor

app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

app.get('/', (req,res)=>{
    res.send('API working')
})

app.listen(port, ()=> console.log("server started",port))
