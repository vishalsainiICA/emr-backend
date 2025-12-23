import bcrypt from "bcryptjs";
import { generateToken } from "../utills/jwtToken.js";
import UserModel from "../models/userModel.js";
import HospitalModel from "../models/hospital.js";
import PatientModel from "../models/patientModel.js"


export const getProfile = async (req, res) => {
    console.log(req.user);
    try {
        const user = req.user
        const profile = await UserModel.findById(user?.id).populate('hospitalId')
        if (!profile) return res.status(404).json({ message: "user not found" });

        return res.status(200).json({ message: "Success", data: profile });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });

    }
}

export const findHospitalByMedicalDirectorId = async (req, res) => {

    try {
        const user = req.user
        if (!user.id) return res.status(400).json({ message: 'medicalDirector id is requried' })

        const hosptial = await HospitalModel.findOne({ medicalDirector: user.id, isDeleted: false })
        return res.status(200).json({ message: 'success', data: hosptial })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' })

    }
}


export const allPatients = async (req, res) => {
    try {

        const date = req.query?.date;
        const status = req.query?.status;
        const user = req.user
        const profile = await UserModel.findById(user?.id)
        if (!profile) return res.status(404).json({ message: "user not found" });


        let query = {
            isDeleted: false,
            hospitalId: profile?.hospitalId

        };

        // 🔹 1) If DATE given → always apply DATE filter
        if (date) {
            const selected = new Date(date);

            const start = new Date(selected);
            start.setHours(0, 0, 0, 0);

            const end = new Date(selected);
            end.setHours(23, 59, 59, 999);

            query.updatedAt = { $gte: start, $lte: end };

            // date wale filter me initial assessment required
            query.initialAssementId = { $ne: null };
        }

        // 🔹 2) STATUS = TODAY
        else if (status === "today") {

            const start = new Date();
            start.setHours(0, 0, 0, 0);

            const end = new Date();
            end.setHours(23, 59, 59, 999);

            query.updatedAt = { $gte: start, $lte: end };
            query.initialAssementId = { $ne: null };
        }

        // 🔹 3) STATUS = POSTPONED
        else if (status === "postponed") {
            query.status = "Postponed";
        }

        else if (status === "rx-done") {
            query.prescribtionId = { $ne: null }
        }

        // 🔹 4) STATUS = CANCEL
        else if (status === "cancel") {
            query.status = "Cancel";
        }

        // 🔹 5) STATUS = ALL → no extra filter
        else if (status === "all") { }

        // 🔹 6) DEFAULT → TODAY


        const patients = await PatientModel.find(query).populate('hospitalId doctorId prescribtionId initialAssementId').sort({ updatedAt: -1 })

        return res.status(200).json({
            message: "success",
            status: 200,
            data: patients
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
export const hosptialPatients = async (req, res) => {
    try {
        const user = req.user
        const profile = await UserModel.findById(user?.id).populate('hospitalId')
        if (!profile) return res.status(404).json({ message: "user not found" });

        const patients = await PatientModel.find({ isDeleted: false, hospitalId: profile?.hospitalId, prescribtionId: { $ne: null } }).populate('hospitalId doctorId prescribtionId initialAssementId')

        return res.status(200).json({
            message: "success",
            status: 200,
            data: patients
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


