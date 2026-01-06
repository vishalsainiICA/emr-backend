import mongoose from "mongoose";
const labtestSchema = new mongoose.Schema(
    {
  key: "string",
  test: "string",
  disease: ["string"],
  confidence: "number"
}

,{ timestamps: true });

const LabtestModel = mongoose.model("labtest", labtestSchema);

export default LabtestModel;
