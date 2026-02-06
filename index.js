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
import labtestModel from './models/labtestModel.js';
import handleApiLimit from './middlewares/apiLimiter.js';
dotenv.config();
const app = express();
dbConnect();

app.use(cors({

    origin: process.env.Frontend_LINK_DEV,  // frontend ka address
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

app.use('/super-admin', superAdminRoutes)
app.use('/admin', adminRoutes)
app.use('/medical-director', medicalDirectorRoutes)
app.use('/doctor', handleApiLimit, doctorRoutes)
app.use('/assitant', handleApiLimit, assitantRoutes)
app.use('/common', handleApiLimit, commonRoutes)

// to handel same login sytem with diffrent user 
app.post('/api/login', login)
app.get("/", (req, res) => {
    res.status(200).send("Server is Running")
})

app.use("/uploads", express.static("uploads"));

app.listen(process.env.PORT, () => {
    console.log('Server Runs Successfully on', process.env.PORT)
})






