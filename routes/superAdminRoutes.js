

import express from "express";
import { addAdmin, deleteAdmin, getAllAdmins, getAllHospital, getProfile, signupSuperAdmin, updateAdmin } from "../controllers/superAdminServices.js";
import { verifyToken } from "../utills/jwtToken.js";


const app = express.Router()

app.post('/auth/register', signupSuperAdmin)
app.get('/auth/profile', verifyToken, getProfile)
app.get('/hospital/getAllHospital', getAllHospital);
app.post('/admin/add-admin', verifyToken, addAdmin)
app.put('/admin/update-admin', verifyToken, updateAdmin)
app.get('/admin/all-admins', verifyToken, getAllAdmins)
app.delete('/admin/delete-admin', verifyToken, deleteAdmin)

export default app