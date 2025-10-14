import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Types.ObjectId,
            ref: "userModel", // Model ka naam PascalCase me
            default: null
            //   required: true,
        },
        name: { type: String, required: true },
        state: { type: String, default: null },
        city: { type: String, default: null },
        pinCode: { type: String },
        address: { type: String, default: null },
        hospitalLogo: { type: String, default: null },
        patientRegistrationLink: { type: String, default: null },
        medicalDirector: {
            type: mongoose.Types.ObjectId,
            ref: 'userModel',
            default: null,
        },

        patientCategories: [{
            selectedType: { type: String },
            categoryName: { type: String },
        }],
        supportedDepartments: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'department'
            }
        ],
        customLetterPad: {
            headerName: String,
            disclaimer: String,
            tagline1: String,
            tagline2: String,
            // watermarkImg: String,
            watermarkText: String,
            headerEmail: String,
            headerPhone: String,
        },
        parentHospital: {
            type: mongoose.Types.ObjectId,
            ref: "hospital",
            default: null,
        },
        isPrimary: {
            type: Boolean,
            default: false,
        },
        branches: {
            type: [{ type: mongoose.Types.ObjectId, ref: "hospital" }],
            default: []
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const HospitalModel = mongoose.model("hospital", hospitalSchema); // Model name PascalCase singular

export default HospitalModel;
