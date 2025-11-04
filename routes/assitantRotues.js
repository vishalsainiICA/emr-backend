import express from "express";

import { saveInitialAssessments } from "../controllers/assitantServices.js";
import { verifyToken } from "../utills/jwtToken.js";

const app = express.Router()

// app.get('/auth/profile', verifyToken, )
// app.get('/today-Patient', todayPatient)
// app.get('/all-patient-record', getAllPatientRecords)
app.post('/intital-assement', saveInitialAssessments)
export default app