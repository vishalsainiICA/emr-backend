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
import handleApiLimit from './middlewares/apiLimiter.js';
import cookieParser from "cookie-parser"
import requestLogger, { auditLog } from './middlewares/apiLogger.middleware.js'
import errorHandler from './middlewares/error.middleware.js';
// import requestId from './middlewares/requestId.middleware.js'

dotenv.config();
const app = express();
dbConnect();
app.set("trust proxy", true);
app.use(cors({

    origin: process.env.Frontend_LINK_DEV,  // frontend ka address
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger)
app.get("/", (req, res, next) => {
    try {
        console.log(r);
        throw new Error("testin errror")

    } catch (error) {
        next(error)
    }
})
app.use('/super-admin', superAdminRoutes)
app.use('/admin', adminRoutes)
app.use('/medical-director', medicalDirectorRoutes)
app.use('/doctor', handleApiLimit, doctorRoutes)
app.use('/assitant', handleApiLimit, assitantRoutes)
app.use('/common', handleApiLimit, commonRoutes)

// to handel same login sytem with diffrent user 
app.post('/api/login', login)


app.use("/uploads", express.static("uploads"));

app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log('Server Runs Successfully on', process.env.PORT)
})






