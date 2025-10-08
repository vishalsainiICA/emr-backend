import express from "express";
import { verifyToken } from "../utills/jwtToken.js";
import { AllDepartmentsByHospitalById, findHospitalByMedicalDirectorId, getProfile } from "../controllers/medicalDirectorServices.js";

const app = express.Router()

// app.post('create-hosptial', createHospital)
// app.post('create-medicalDirector', createHospital)
app.get('/auth/profile', verifyToken, getProfile)
app.get('/hospital/hospitalByDirId', verifyToken, findHospitalByMedicalDirectorId)
app.get('/hospital/all-department', verifyToken, AllDepartmentsByHospitalById)

export default app