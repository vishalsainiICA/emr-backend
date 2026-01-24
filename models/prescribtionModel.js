import mongoose from "mongoose";


const prescribtionShehma = mongoose.Schema({
    patientId: {
        type: mongoose.Types.ObjectId,
        ref: 'patient'
    },
    initialAssementId: {
        type: mongoose.Types.ObjectId,
        ref: 'initialassessment'
    },
    doctorId: {
        type: mongoose.Types.ObjectId,
        ref: 'doctor'
    },
    hospitalId: {
        type: mongoose.Types.ObjectId,
        ref: 'hospital'
    },
    prescriptionType: {
        // final prescription || provisional prescription
        type: String,
        default: null
    },

    prescriptionfees: {
        // final prescription || provisional prescription
        type: Number,
        default: null
    },


    illness: {
        type: String,
        default: null
    },
    symptoms: {
        type: String,
        default: null
    },
    prescriptionMediciene: {
        type: String,
        default: null
    },

    labTest: {
        type: Array,
        default: null
    },
    prescriptionImage: {
        type: String,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
})

const PrescribtionModel = mongoose.model('prescribtion', prescribtionShehma)
export default PrescribtionModel