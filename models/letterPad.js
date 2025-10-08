import mongoose from "mongoose";

const customLetterPadSchema = new mongoose.Schema(
    {
        headerName: String,
        disclaimer: String,
        tagline1: String,
        tagline2: String,
        watermarkImg: String,
        watermarkText: String,
        headerEmail: String,
        headerPhone: String,
        isDeleted: {
            type: Boolean,
            default: false,
        },
    }, { timestamps: true });

const CustomLetterPad = mongoose.model("customLetterPad", customLetterPadSchema);

export default CustomLetterPad
