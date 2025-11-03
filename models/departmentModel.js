import mongoose from "mongoose";


const departmentSchema = new mongoose.Schema({
    departmentName: { type: String, required: true, trim: true },
    image: { type: String, default: null },
    description: { type: String },
    hospitalId: {
        type: mongoose.Types.ObjectId,
        ref: "hospital", // Model ka naam PascalCase me
        //   required: true,
    },
    adminId: {
        type: mongoose.Types.ObjectId,
        ref: "userModel", // Model ka naam PascalCase me
        //   required: true,
    },
    doctorIds: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'userModel'
        }
    ],
    isDeleted: {
        type: Boolean,
        default: false,
    },

}, {
    timestamps: true
});

const DepartmentModel = mongoose.model('department', departmentSchema)

export default DepartmentModel