import express from "express";
import { verifyToken } from "../utills/jwtToken.js";

import { addBranch, addHospital, addSingleDepartment, deleteHospital, deleteSingleDepartment, findHospitalById, registerPatient, updateHospital } from "../controllers/commonServices.js";
import upload from "../middlewares/multer.js";


const app = express();


// app.post('createAdmin' , addAdmin)

app.post('/hospital/addHospital', verifyToken, addHospital);
app.post('/hospital/add-branch', verifyToken, addBranch);
app.get('/hospital/single-hospital', findHospitalById);
app.put('/hospital/update-hospital', updateHospital)
app.delete('/hospital/delete-hospital', deleteHospital)
app.delete('/hospital/delete-department', deleteSingleDepartment)
app.post('/hospital/new-department', addSingleDepartment)


// patient
app.post('/patient/register-patient', upload.array('pastDocumnents'), registerPatient)


export default app;