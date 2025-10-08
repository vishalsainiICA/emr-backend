import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    salt: {
        type: String,
        required: true,
        trim: true
    },
    strength: {
        type: String,
        required: true,
        trim: true
    },
    availability: {
        type: String,
        enum: ["available", "low-stock", "out-of-stock"],
        default: "available"
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    problem: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

const Medication = mongoose.model("Medication", medicationSchema);

export default Medication;
