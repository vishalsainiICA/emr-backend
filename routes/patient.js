import express from "express";
import { getAllPatients, getAllPatientsAssement, registerPatient, saveInitialAssessments, savePrescribtionData, verifyUId } from "../controllers/patientController.js";
import { upload, uploadToGridFs } from "../middlewares/uploadToGridFS.js";
import { verifyToken } from "../utills/jwtToken.js";
const app = express();
app.post('/patient-registration', verifyToken, upload.array('reports'), uploadToGridFs, registerPatient);
app.post('/initialassessment', verifyToken, saveInitialAssessments);
app.post('/prescribtion-data', verifyToken, savePrescribtionData);
app.get('/verifyUID', verifyToken, verifyUId);
app.get('/getAllPatients', getAllPatients)
app.get('/getAllPatientsAssement', getAllPatientsAssement)

export default app;