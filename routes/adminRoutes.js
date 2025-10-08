import express from "express";
import { verifyToken } from "../utills/jwtToken.js";
import { getAllHospital, getProfile } from "../controllers/adminServices.js";

const app = express.Router()

// app.post('create-hosptial', createHospital)
// app.post('create-medicalDirector', createHospital)
app.get('/auth/admin-profile', verifyToken, getProfile)
app.get('/hospital/all-hospitals', verifyToken, getAllHospital)


export default app