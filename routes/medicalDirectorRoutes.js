import express from "express";
import { verifyToken } from "../utills/jwtToken.js";
import { allPatients, findHospitalByMedicalDirectorId, getProfile, hosptialPatients } from "../controllers/medicalDirectorServices.js";



const app = express.Router()

app.get('/auth/profile', verifyToken, getProfile)
app.get('/getHospital', verifyToken, findHospitalByMedicalDirectorId)
app.get('/patients/hospitalAllPaitent', verifyToken, hosptialPatients)
app.get('/patients/allPatients',verifyToken, allPatients)
// app.post('create-medicalDirector', createHospital)
// app.get('/auth/profile', verifyToken, getProfile)



export default app