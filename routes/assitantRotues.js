import express from "express";
import { dailyActivity, editProfile, getAllPatientRecords, getProfile, getWitNoAssessmentPatient, registerPatient, saveInitialAssessment } from "../controllers/assitantServices.js";
import { verifyToken } from "../utills/jwtToken.js";
import upload from "../middlewares/multer.js";

const app = express.Router()

// app.get('/auth/profile', verifyToken, )
app.post('/patient/register-patient', verifyToken, upload.fields([{ name: 'documents' },
{ name: "addharfront" },
{ name: "addharback" }

]), registerPatient)

app.get('/auth/profile', verifyToken, getProfile)
app.put('/auth/edit-profile', upload.none(), verifyToken, editProfile)
app.put('/auth/edit-profile', upload.none(), verifyToken, editProfile)
app.get('/today-patient', verifyToken, getAllPatientRecords)
app.get('/no-assessment-patient', verifyToken, getWitNoAssessmentPatient)
app.get('/all-patient-record', verifyToken, getAllPatientRecords)
app.get("/daily-activity", verifyToken, dailyActivity)
app.post('/intital-assement', saveInitialAssessment)
export default app