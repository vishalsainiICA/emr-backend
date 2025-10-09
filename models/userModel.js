
import mongoose from "mongoose";

const UserShcema = new mongoose.Schema({
    name: { type: String, default: null },
    email: { type: String, default: null },
    password: { type: String, default: "123456" },
    contact: { type: String, default: null },
    licenseNo: { type: String, default: null },
    signatureImage: { type: String, default: null },
    departmentName: { type: String, default: null },
    // doctor Id for personal Assitant creation for any doctor
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "userModel" },
    personalAssitantId: { type: mongoose.Schema.Types.ObjectId, ref: "userModel" },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "hospital" },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "userModel" },
    creationFor: { type: String, default: '' },
    role: { type: String, default: '' },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const UserModel = mongoose.model("userModel", UserShcema);

export default UserModel
