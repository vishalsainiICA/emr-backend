import mongoose from "mongoose";


const personalAssitantSchema = mongoose.Schema({

    paName: String,
    paEmail: String,
    password: String,
    desination: String,
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true })
const PersonalAssitantModel = mongoose.model('personalAssitant', personalAssitantSchema)

export default PersonalAssitantModel