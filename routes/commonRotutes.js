import express from "express";
import { verifyToken } from "../utills/jwtToken.js";

import { addBranch, addHospital, addDepartments, changePatientStatus, deleteHospital, deleteSingleDepartment, editHospital, findHospitalById, patientsByHospitalById, registerPatient, removeDoctorById, updateHospital, updateProfile, validateMobileNo, getAllIllness, updatePatient } from "../controllers/commonServices.js";
import upload from "../middlewares/multer.js";



const app = express();


// app.post('createAdmin' , addAdmin)

app.post('/hospital/addHospital', upload.fields([
    {
        name: "medicalDirectorImage", maxCount: 1
    },
    {
        name: "watermarkImg", maxCount: 1
    }
]), addHospital);
app.post('/hospital/add-branch', verifyToken, addBranch);
app.put('/hospital/edit-hospital', upload.none(), editHospital);
app.get('/hospital/single-hospital', findHospitalById);
app.put('/hospital/update-hospital', updateHospital)
app.delete('/hospital/delete-hospital', deleteHospital)
app.delete('/hospital/delete-department', deleteSingleDepartment)
app.post('/hospital/new-department', addDepartments)
app.get('/hospital/all-patients', patientsByHospitalById)
app.put("/hospital/update-profile", updateProfile)
app.put('/change-status', changePatientStatus)


// patient
app.post('/patient/register-patient', verifyToken, upload.fields([{ name: 'documents' },
{ name: "aadhaarFront" },
{ name: "aadhaarBack" }

]), registerPatient)
app.post('/patient/update-patient', verifyToken, upload.fields([{ name: 'documents' },
{ name: "aadhaarFront" },
{ name: "aadhaarBack" }

]), updatePatient)
app.post('/patient/validate-mobile', validateMobileNo);
app.get('/patient/illness', getAllIllness);


// doctor

app.delete("/doctor/remove-doc", removeDoctorById)


export default app;