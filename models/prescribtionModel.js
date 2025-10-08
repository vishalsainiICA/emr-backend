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
    prescriptionType: {
        // final prescription || provisional prescription
        type: String,
        default: null
    },

    prescriptionMediciene: {
        type: Array,
        default: null
    },
    labTest: {
        type: Array,
        default: null
    },
    followUp: {
        type: Array,
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