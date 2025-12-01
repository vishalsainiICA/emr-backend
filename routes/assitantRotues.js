import express from "express";
import { getAllPatientRecords, getProfile, registerPatient, saveInitialAssessments } from "../controllers/assitantServices.js";
import { verifyToken } from "../utills/jwtToken.js";
import upload from "../middlewares/multer.js";

const app = express.Router()

// app.get('/auth/profile', verifyToken, )
app.post('/patient/register-patient', verifyToken, upload.fields([{ name: 'documents' },
{ name: "addharfront" },
{ name: "addharback" }

]), registerPatient)

app.get('/auth/profile', verifyToken, getProfile)
app.get('/all-patient-record', verifyToken, getAllPatientRecords)
app.post('/intital-assement', saveInitialAssessments)
export default app