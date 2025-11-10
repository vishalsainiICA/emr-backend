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
app.use(cors({

    origin: process.env.Frontend_LINK_DEV,  // frontend ka address
    // origin: "https://new-emr-pqlz.onrender.com ",  // frontend ka address
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

app.use('/api/super-admin', superAdminRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/medical-director', medicalDirectorRoutes)
app.use('/api/doctor', doctorRoutes)
app.use('/api/assitant', assitantRoutes)
app.use('/api/common', commonRoutes)

// to handel same login sytem with diffrent user 
app.post('/api/login', login)

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('/*allRoutes', (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

app.listen(process.env.PORT, () => {
    console.log('Server Runs Successfully on', process.env.PORT)
})




