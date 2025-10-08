import express from "express";
import { registerPatient } from "../controllers/patientController.js";
import { upload, uploadToGridFs } from "../middlewares/uploadToGridFS.js";
import { getPatientsForDoctor } from "../controllers/doctorController.js";

const app = express();

app.get('/patientfordoctor/:id', getPatientsForDoctor);
// app.get('emrMatrix', get)


export default app;