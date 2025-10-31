

import express from "express";
import {
    addAdmin, allPatients, deleteAdmin, getAllAdmins,
    getAllHospital, getProfile,
    hosptialMetrices,
    signupSuperAdmin,
    updateAdmin
} from "../controllers/superAdminServices.js";
import { verifyToken } from "../utills/jwtToken.js";


const app = express.Router()

app.post('/auth/register', signupSuperAdmin)
app.get('/auth/profile', verifyToken, getProfile)
app.get('/hospital/getAllHospital', getAllHospital);
app.get('/hospital/hosptial-metrices', hosptialMetrices);
app.post('/admin/add-admin', addAdmin)
app.put('/admin/update-admin', verifyToken, updateAdmin)
app.get('/admin/all-admins', getAllAdmins)
app.delete('/admin/delete-admin', deleteAdmin)


// Patients

app.get('/patients/allPatients', allPatients)

export default app