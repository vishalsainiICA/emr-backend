import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema({
    medicine_name: {
        type: String,
        trim: true
    },
    salt: {
        type: String,
    },
    dosage: {
        type: String,
    },
}, { timestamps: true });

const Medication = mongoose.model("Medication", medicationSchema);

export default Medication;
