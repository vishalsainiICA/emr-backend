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