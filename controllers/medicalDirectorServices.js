import bcrypt from "bcryptjs";
import { generateToken } from "../utills/jwtToken.js";
import UserModel from "../models/userModel.js";
import HospitalModel from "../models/hospital.js";
import PatientModel from "../models/patientModel.js"
import PrescribtionModel from "../models/prescribtionModel.js";


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
        const user = req.user;

        const profile = await UserModel
            .findById(user?.id)
            .populate('hospitalId');

        if (!profile) {
            return res.status(404).json({ message: "User not found" });
        }

        const { status } = req.query;

        // -----------------------------
        // 1 PATIENTS → ONLY TODAY
        // -----------------------------
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const patients = await PatientModel
            .find({
                isDeleted: false,
                hospitalId: profile.hospitalId,
                updatedAt: { $gte: todayStart, $lte: todayEnd }
            })
            .populate('hospitalId doctorId prescribtionId initialAssementId');

        // -----------------------------
        //  PRESCRIPTION DATE RANGE
        // -----------------------------
        let startDate;
        let endDate = new Date();
        const now = new Date();

        // --------------------
        // WEEKLY → last 7 days
        // --------------------
        if (status === "weekly") {

            startDate = new Date();
            startDate.setDate(now.getDate() - 6);

            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
        }

        // --------------------
        // MONTHLY → last 30 days
        // --------------------
        else if (status === "monthly") {

            startDate = new Date();
            startDate.setDate(now.getDate() - 29);

            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
        }

        // --------------------
        // YEARLY → last 365 days
        // --------------------
        else if (status === "yearly") {

            startDate = new Date();
            startDate.setDate(now.getDate() - 364);

            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
        }

        // --------------------
        // DEFAULT → today only
        // --------------------
        else {

            startDate = new Date();
            startDate.setHours(0, 0, 0, 0);

            endDate.setHours(23, 59, 59, 999);
        }
        // -----------------------------
        //  PRESCRIPTIONS → ONLY prescriptionFees
        // -----------------------------
        const prescriptions = await PrescribtionModel.find(
            {
                isDeleted: false,
                hospitalId: profile.hospitalId,
                createdAt: { $gte: startDate, $lte: endDate }
            },
            { prescriptionfees: 1, _id: 0 }
        );

        const fees = prescriptions.map(p => p.prescriptionfees);


        // -----------------------------
        // RESPONSE
        // -----------------------------
        return res.status(200).json({
            message: "success",
            status: 200,
            data: patients,
            prescriptionPeriod: status || "today",
            prescriptionFees: fees,
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const findHospital = async (req, res) => {

    try {
        const user = req.user
        console.log("user", user);

        const profile = await UserModel.findById(user?.id)
        if (!profile) return res.status(404).json({ message: "user not found" });

        const id = profile?.hospitalId
        if (!id) return res.status(400).json({ message: 'hospital id is requried' })


        const hosptial = await HospitalModel.findOne({
            _id: id, isDeleted: false,
        }).populate({
            path: "supportedDepartments",
            populate: {
                path: "doctorIds",
                match: { isDeleted: false },
                populate: {
                    path: "personalAssistantId",
                    match: { isDeleted: false },
                }
            },
        }).populate('medicalDirector')

        return res.status(200).json({
            message: 'success', data: hosptial,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' })

    }
}

