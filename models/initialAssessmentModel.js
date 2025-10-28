import mongoose from "mongoose";


const patientSchema = new mongoose.Schema({

    patientId: { type: mongoose.Types.ObjectId, ref: 'patient' },
    uid: String,
    height: Number,
    weight: Number,
    BP: Number,
    bloodGroup: String,
    o2: Number,
    heartRate: Number,
    sugar: Number,
    hemoglobin: Number,
    bodyTempreture: Number,
    respiratoryRate: Number,
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