import express from "express";

import { getAllPatientRecords, saveInitialAssessments } from "../controllers/assitantServices.js";

const app = express.Router()

// app.get('/auth/profile', verifyToken, )
// app.get('/today-Patient', todayPatient)
app.get('/all-patient-record', getAllPatientRecords)
app.post('/intital-assement', saveInitialAssessments)
export default app