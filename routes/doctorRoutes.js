import express from "express";
import { verifyToken } from "../utills/jwtToken.js";
import { getAllIllness, getAllPatientRecords, getProfile, todayPatient } from "../controllers/doctorServices.js";

const app = express.Router()

app.get('/all-illness', getAllIllness)

// app.post('create-hosptial', createHospital)
// app.post('create-medicalDirector', createHospital)
app.get('/auth/profile', verifyToken, getProfile)
app.get('/today-Patient', todayPatient)
app.get('/all-patient-record', getAllPatientRecords)
export default app