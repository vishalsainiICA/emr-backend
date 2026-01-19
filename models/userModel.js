
import mongoose from "mongoose";
import { boolean } from "webidl-conversions";

const UserShcema = new mongoose.Schema({
    name: { type: String, default: null },
    email: { type: String, default: null },
    password: { type: String, default: "123456" },
    contact: { type: String, default: null },
    createdfor: { type: String, default: null },
    gender: { type: String, default: null },
    experience: { type: String, default: null },
    qualification: { type: String, default: null },
    signatureImage: { type: String, default: null },
    departmentName: { type: String, default: null },
    // doctor Id for personal Assitant creation for any doctor
    personalAssitantId: { type: mongoose.Schema.Types.ObjectId, ref: "userModel" },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "hospital" },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "userModel" },
    totalPatient: { type: Number, default: 0 },
    totalPrescriptions: { type: Number, default: 0 },
    totalLabTests: { type: Number, default: 0 },
    creationfor: { type: String, default: '' },

 role: { type: String, enum: ['superadmin', 'admin', 'medicalDirector', 'doctor', 'personalAssitant'] },
    status: { type: Boolean, default: false },
    image: { type: String, default: '' },
    appointmentFees: { type: Number, default: 0 },
assignDoctors: {
  type: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel"
    }
  ],
},
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const UserModel = mongoose.model("userModel", UserShcema);

export default UserModel
