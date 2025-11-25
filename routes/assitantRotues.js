import express from "express";

import { getAllPatientRecords, getProfile, saveInitialAssessments } from "../controllers/assitantServices.js";
import { verifyToken } from "../utills/jwtToken.js";

const app = express.Router()

// app.get('/auth/profile', verifyToken, )
app.get('/auth/profile',verifyToken, getProfile)
app.get('/all-patient-record',verifyToken, getAllPatientRecords)
app.post('/intital-assement', saveInitialAssessments)
export default app