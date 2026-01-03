import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from './utills/dbConnect.js';
import { login } from './utills/jwtToken.js';
import superAdminRoutes from './routes/superAdminRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import medicalDirectorRoutes from './routes/medicalDirectorRoutes.js'
import doctorRoutes from './routes/doctorRoutes.js'
import commonRoutes from './routes/commonRotutes.js'
import assitantRoutes from './routes/assitantRotues.js'
import path from 'path'

dotenv.config();
const app = express();
dbConnect();
const allowedOrigins = [
  "http://192.168.1.39:5173",
  "http://localhost:5173",
  "*"
];


app.use(cors({

    // origin: allowedOrigins,  // frontend ka address
    origin: "https://new-emr-pqlz.onrender.com",  // frontend ka address
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

// Data fetched successfully for SBIN
// Data fetched successfully for RELIANCE
// error Can only compare identically-labeled Series objects
// error Can only compare identically-labeled Series objects
// All Threads is completed for this timeframe15m
// INFO:app.logger:[15m] Processed strategies.

app.use('/api/super-admin', superAdminRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/medical-director', medicalDirectorRoutes)
app.use('/api/doctor', doctorRoutes)
app.use('/api/assitant', assitantRoutes)
app.use('/api/common', commonRoutes)

// to handel same login sytem with diffrent user 
app.post('/api/login', login)
app.get("/", (req, res) => {
    res.status(200).send("Server is Running")
})

app.use("/uploads", express.static("uploads"));

app.listen(process.env.PORT, () => {
    console.log('Server Runs Successfully on', process.env.PORT)
})




