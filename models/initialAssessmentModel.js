import mongoose from "mongoose";

const vitalsSchema = new mongoose.Schema(
  {
    bp: { type: String },                // 120/80
    heartRate: { type: String },         // 72 bpm
    temperature: { type: String },       // 98.6 F / 37 C
    respRate: { type: String },          // 16/min
    spo2: { type: String },              // 98 %
    weight: { type: String },            // 75 kg
    height: { type: String },            // 175 cm
    bloodgroup: { type: String }           // 175 cm
  },
  { _id: false }
);

const initialAssessmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
      required: true
    },

    vitals: vitalsSchema,

    complaint: {
      type: String,
      trim: true
    },

    medicalHistory: {
      type: String,
      trim: true
    },

    physicalExam: {
      type: String,
      trim: true
    },

    notes: {
      type: String,
      trim: true
    },

    selectedSym: {
      type: [String],
      default: []
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);
const InitialAssesment = new mongoose.model('initialassessment', initialAssessmentSchema);

export default InitialAssesment;



