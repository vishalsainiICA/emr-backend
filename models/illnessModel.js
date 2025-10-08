import mongoose from "mongoose";


const illnessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,   // optional, ek hi illness bar bar na aaye
        trim: true
    }
}, { timestamps: true });

const Illness = mongoose.model("illnessSuggestions", illnessSchema);

export default Illness;