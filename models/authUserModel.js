import mongoose from "mongoose";

const authUserSchema = mongoose.Schema({
    email: { type: String },
    contact: { type: String },
    password: { type: String },
    role: { type: String, enum: ['super-admin', 'admin', 'medicalDirector', 'doctor', 'personalAssitant'] },
    refId: { type: mongoose.Types.ObjectId, default: null },
    isDeleted: {
        type: Boolean,
        default: false,
    },
})

const AuthUserModel = mongoose.model('AuthUserModel', authUserSchema)

export default AuthUserModel