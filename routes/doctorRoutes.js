import express from "express";
import { verifyToken } from "../utills/jwtToken.js";
import { changePatientStatus, getAllIllness, getAllPatientRecords, getProfile, savePrescribtion, todayPatient } from "../controllers/doctorServices.js";
import upload from "../middlewares/multer.js";

const app = express.Router()

app.get('/all-illness', getAllIllness)

// app.post('create-hosptial', createHospital) 
app.post('/save-prescribtion', upload.single("prescriptionImage"), savePrescribtion)
app.get('/auth/profile', verifyToken, getProfile)
app.get('/today-Patient', todayPatient)
app.put('/change-status', changePatientStatus)
app.get('/all-patient-record',verifyToken, getAllPatientRecords)
export default app