import express from "express";
import { verifyToken } from "../utills/jwtToken.js";
import { getProfile } from "../controllers/doctorServices.js";

const app = express.Router()

// app.post('create-hosptial', createHospital)
// app.post('create-medicalDirector', createHospital)
app.get('/auth/profile', verifyToken, getProfile)
export default app