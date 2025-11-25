

import express from "express";
import {
    addAdmin, allPatients, deleteAdmin, deletePa, getAllAdmins,
    getAllHospital, getProfile,
    hosptialMetrices,
    hosptialPatients,
    signupSuperAdmin,
    updateAdmin
} from "../controllers/superAdminServices.js";
import { verifyToken } from "../utills/jwtToken.js";
import { addPersonalAssitant } from "../controllers/commonServices.js";


const app = express.Router()

app.post('/auth/register', signupSuperAdmin)
app.get('/auth/profile', verifyToken, getProfile)
app.get('/hospital/getAllHospital', getAllHospital);
app.get('/hospital/hosptial-metrices', hosptialMetrices);
app.post('/admin/add-admin', addAdmin)
app.put('/admin/update-admin', verifyToken, updateAdmin)
app.get('/admin/all-admins', getAllAdmins)
app.delete('/admin/delete-admin', deleteAdmin)
app.delete('/hospital/delete-pa', deletePa)


// Patients
app.post("/doctor/add-pa", verifyToken, addPersonalAssitant)

app.get('/patients/allPatients', allPatients)
app.get('/patients/hospitalAllPaitent', hosptialPatients)

export default app