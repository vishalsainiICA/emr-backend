

import express from "express";
import {
    addAdmin, allPatients, deleteAdmin, deletePa, editProfile, getAllAdmins,
    getAllHospital, getProfile,
    hosptialMetrices,
    hosptialPatients,
    signupSuperAdmin,
    updateAdmin,
    updateStatus
} from "../controllers/superAdminServices.js";
import { verifyToken } from "../utills/jwtToken.js";
import { addpersonalAssistant } from "../controllers/commonServices.js";
import upload from "../middlewares/multer.js";


const app = express.Router()

app.post('/auth/register', signupSuperAdmin)
app.get('/auth/profile', verifyToken, getProfile)
app.put('/auth/edit-profile', upload.none(), verifyToken, editProfile)
app.get('/hospital/getAllHospital', getAllHospital);
app.get('/hospital/hosptial-metrices', hosptialMetrices);
app.post('/admin/add-admin', addAdmin)
app.put('/admin/update-admin', verifyToken, updateAdmin)
app.put('/admin/update-status', verifyToken, updateStatus)
app.get('/admin/all-admins', getAllAdmins)
app.delete('/admin/delete-admin', deleteAdmin)
app.delete('/hospital/delete-pa', deletePa)


// Patients
app.post("/doctor/add-pa", verifyToken, addpersonalAssistant)

app.get('/patients/allPatients', allPatients)
app.get('/patients/hospitalAllPaitent', hosptialPatients)

export default app