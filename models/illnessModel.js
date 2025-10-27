import mongoose from "mongoose";


const illnessSchema = new mongoose.Schema({
    illnessName: {
        type: String
    },
    symptoms: [
        {
            type: String
        }
    ]
}, { timestamps: true });

const IllnessModel = mongoose.model("illness", illnessSchema);

export default IllnessModel;

