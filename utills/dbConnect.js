import mongoose from "mongoose"

const hospitalSchema = new mongoose.Schema(
  {
    // ===== BASIC INFORMATION =====
    name: {
      type: String,
      required: [true, "Hospital name is required"],
      trim: true,
      index: true
    },

    hospitalCode: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true
    },

    city: {
      type: String,
      trim: true,
      index: true
    },

    // ===== CONTACT INFORMATION =====
    contactNumbers: [{
      type: String,
      trim: true
    }],

    corporateAddress: {
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
      country: String
    },

    email: {
      type: String,
      trim: true,
      lowercase: true
    },

    website: {
      type: String,
      trim: true
    },

    // ===== EMPANELMENT =====
    empanelmentList: [{
      type: String,
      trim: true
    }],

    // ===== STATUS =====
    isActive: {
      type: Boolean,
      default: true
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }

  },
  {
    timestamps: true,
    collection: "hospitals"
  });

const HospitalModel = mongoose.model("Hospital", hospitalSchema);
export default HospitalModel


const HOSPITAL_FIELDS = [
  'ID', 'name', 'trimmedName', 'city', 'contactNumbers',
  'accountDetails', 'managementDetails', 'corporateAddress',
  'hospitalCode', 'branches', 'departments', 'empanelmentList',
  'testLabs', 'codeAnnouncements', 'ipdDetails', 'dayCareDetails',
  'procedureList', 'departmentIncharge', 'isDeleted',
  'createdAt', 'updatedAt'
];

/**
 * Sanitize hospital input to only include allowed fields
 * 
 * @param {Object} raw - Raw hospital input
 * @returns {Object} - Sanitized object with only allowed fields
 */
export function sanitizeHospitalPayload(raw = {}) {
  const cleaned = {};

  for (const key of HOSPITAL_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(raw, key)) {
      cleaned[key] = raw[key];
    }
  }

  return cleaned;
}

