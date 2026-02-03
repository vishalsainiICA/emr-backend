import mongoose from "mongoose";

const treatmentHistorySchema = new mongoose.Schema(
    {
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userModel",
            required: true
        },

        prescriptionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "prescribtion",
            default: null
        },

        diagnosis: {
            type: String
        },

        notes: {
            type: String
        },

        treatedAt: {
            type: Date,
            default: Date.now
        },

        initialAssementId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "initialassessment",
            default: null,
        },


        status: {
            type: String,
            default: "Completed"
        },
        pastPatientRecord: [
            {
                category: String,
                files: Array
            }
        ],
        addharDocumnets: {
            addharfrontPath: String,
            addharbackPath: String,
            uploadedAt: { type: Date, default: Date.now }
        },
    },
    { _id: false }
);

const patientSchema = new mongoose.Schema(
    {
        uid: String,

        initialAssementId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "initialassessment",
            default: null,
        },

        hospitalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "hospital",
            default: null
        },

        /*CURRENT / LAST TREATMENT (FAST ACCESS) */
        currentDoctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userModel",
            default: null
        },

        currentPrescriptionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "prescribtion",
            default: null
        },

        registerarId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userModel",
            default: null
        },

        source: {
            type: String,
            default: "web"
        },

        isPrescbribedDone: {
            type: Boolean,
            default: false
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        gender: String,

        status: {
            type: String,
            default: "Assessment Pending"
        },

        phone: String,
        email: {
            type: String,
            lowercase: true,
            trim: true
        },

        DOB: String,
        nationality: String,
        addharNo: String,
        whatsApp: String,

        permanentAddress: String,
        currentAddress: String,

        patientCategory: Object,
        branchName: String,

        attendeeName: String,
        attendeePhone: String,
        attendeeRelation: String,

        cancelReason: String,

        city: String,
        state: String,
        age: Number,

        addharDocumnets: {
            addharfrontPath: String,
            addharbackPath: String,
            uploadedAt: { type: Date, default: Date.now }
        },

        pastDocuments: [
            {
                category: String,
                files: Array
            }
        ],
        pastDocumentSummary: {
            type: Object,
            default: null
        },

        /*FULL TREATMENT HISTORY */
        treatmentHistory: [treatmentHistorySchema],

        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const PatientModel = mongoose.model("patient", patientSchema);
export default PatientModel;
