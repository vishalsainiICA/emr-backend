import mongoose from "mongoose";


const patientSchema = new mongoose.Schema({

    patientId: { type: mongoose.Types.ObjectId, ref: 'patient' },
    uid: String,
    height: String,
    weight: String,
    BP: String,
    bloodGroup: String,
    o2: String,
    heartRate: String,
    sugar: String,
    hemoglobin: String,
    bodyTempreture: String,
    respiratoryRate: String,
    isDeleted: {
        type: Boolean,
        default: false,
    },
},

    {
        timestamps: true
    }
);

const InitialAssesment = new mongoose.model('initialassessment', patientSchema);

export default InitialAssesment;