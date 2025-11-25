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
        source: {
            type: String,
            default: 'web'
        },
        prescribtionId: {
            type: mongoose.Schema.Types.ObjectId, //usually doctor will be another model
            ref: "prescribtion",
            default: null
        },

        isPrescbribedDone: {
            type: Boolean,
            default: false, // patient name should not be empty
        },
        name: {
            type: String,
            required: true, // patient name should not be empty
            trim: true,
        },
        gender: {
            type: String,
            default: null // optional validation
        },
        status: {
            type: String,
            default: "scheduled"
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
            type: String,
        },
        nationality: {
            type: String,
        },
        addharNo: {
            type: String, //phone should be string
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
            type: Object,
        },
        branchName: {
            type: String, // use String for phone
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
        age: {
            type: Number,
        },

        addharDocumnets: {
            addharfrontPath: { type: String },
            addharbackPath: { type: String },
            uploadedAt: { type: Date, default: Date.now }
        },

        pastDocuments: {
            type: [{
                category: { type: String },
                files: { type: Array }
            }],
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