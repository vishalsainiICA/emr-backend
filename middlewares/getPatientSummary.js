import axios from "axios"
import PatientModel from "../models/patientModel.js";


export const getPatientSummary = async (files, patientId) => {
    try {
        const res = await axios.post("https://disease-rag-api-k12s.onrender.com/summarise", files)

        if (res.status === 200) {
            console.log(res.data);

            await PatientModel.findByIdAndUpdate(patientId, {
                $set: {
                    pastDocumentSummary: res.data
                }
            })
        }
    } catch (error) {
        return new Error(error)
    }

}

