import mongoose from "mongoose";


const patientSchema = new mongoose.Schema(
    {
        uid: {
            type: String,
        },
        initialAssementId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "initialassessment",
            default: null,
        },
        name: {
            type: String,
            required: true, // patient name should not be empty
            trim: true,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"], // optional validation
        },
        phone: {
            type: String, //better than Number (leading zeros safe)
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        DOB: {
            type: Date,
        },
        nationality: {
            type: String,
        },
        whatsApp: {
            type: String, //phone should be string
        },
        permanentAddress: {
            type: String,
        },
        currentAddress: {
            type: String,
        },
        patientCategory: {
            type: String,
        },
        attendeeName: {
            type: String,
        },
        attendeePhone: {
            type: String, // use String for phone
        },
        attendeeRelation: {
            type: String,
        },
        reports: {
            type: [String], // array of report file names / URLs
            default: [],
        },
        specialty: {
            type: String,
        },

        hospitalId: {
            type: mongoose.Schema.Types.ObjectId, //usually doctor will be another model
            ref: "hospital",
            default: null
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId, //usually doctor will be another model
            ref: "userModel",
            default: null
        },
        age: {
            type: Number,
        },

        pastDocuments: {
            type: Array,
            default: null
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },

    {
        timestamps: true,
    },

);


const PatientModel = new mongoose.model('patient', patientSchema);

export default PatientModel;