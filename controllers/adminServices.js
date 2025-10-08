
import bcrypt from "bcryptjs";
import { generateToken } from "../utills/jwtToken.js";
import UserModel from "../models/userModel.js";
import HospitalModel from "../models/hospital.js";
import mongoose from "mongoose";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(req.body);

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user);

        return res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        console.log("Error in login:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const getProfile = async (req, res) => {
    console.log(req.user);
    try {
        const user = req.user
        const profile = await UserModel.findById(user?.id)
        if (!profile) return res.status(404).json({ message: "user not found" });

        return res.status(200).json({ message: "Success", data: profile });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });

    }
}

export const createMedicalDirector = async (req, res) => {
    try {
        const { email, name, password } = req.body
        const { adminId } = req.user

        if (!email || !name || !password) return res.status(400).json({ message: 'email , name , password' })

        const superAdmin = await UserModel.findById(adminId)

        if (!superAdmin) return res.status(400).json({ message: 'unAuthorized' })

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(String(password), salt);

        const newMedicalDirector = UserModel({
            adminId,
            name,
            email,
            hashPassword
        })
        await newMedicalDirector.save()
        return res.status(200).json({ message: 'new MedicalDirector create successfully' })

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })

    }
}


export const getAllHospital = async (req, res) => {

    try {
        const admin = req.user
        const hosptials = await HospitalModel.find({ adminId: admin.id,isDeleted: false })
            .populate({
                path: "supportedDepartments",
                populate: {
                    path: "doctorIds",
                },
            })
            .populate("customLetterPad");

        return res.status(200).json({ message: 'success', data: hosptials })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' })

    }
}