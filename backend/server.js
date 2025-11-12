import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()

// ✅ CORS middleware (add this BEFORE routes)
app.use(cors({
  origin: ['http://localhost:5176', 'http://localhost:5173'], // allow both
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));

// middleware
app.use(express.json())

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)


app.get('/', (req, res) => {
    res.send("API working...")
})

app.listen(port, () => console.log("Server is running at :", port)) 