import mongoose from "mongoose";

const authUserSchema = mongoose.Schema({
    email: { type: String },
    contact: { type: String },
    password: { type: String },
    role: { type: String, enum: ['superadmin', 'admin', 'medicalDirector', 'doctor', 'personalAssistant'] },
    refId: { type: mongoose.Types.ObjectId, ref: "userModel", default: null },
    isDeleted: {
        type: Boolean,
        default: false,
    },
})

const AuthUserModel = mongoose.model('AuthUserModel', authUserSchema)

export default AuthUserModel