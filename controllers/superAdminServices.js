
import bcrypt from 'bcryptjs'
import { generateToken } from "../utills/jwtToken.js";
import AuthUserModel from '../models/authUserModel.js';
import HospitalModel from '../models/hospital.js';
import UserModel from '../models/userModel.js';
import PatientModel from '../models/patientModel.js';
import PersonalAssitantModel from '../models/personalAssitantModel.js';




export const signupSuperAdmin = async (req, res) => {
    try {
        const { name, contact, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(String(password), salt);

        const newUser = new UserModel({
            name,
            email,
            contact,
            password: password,
            role: 'super-admin',
        });

        await newUser.save();

        const authUser = await AuthUserModel.create({
            name,
            email,
            contact,
            password: password,
            role: 'super-admin',
            refId: newUser?._id
        })

        const token = generateToken(newUser);

        return res.status(201).json({
            message: "Signup Successful",
            token,
            data: authUser?._id
        });
    } catch (error) {
        console.log("Error in signup:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

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
export const addAdmin = async (req, res) => {
    try {
        const { name, email, contact, password, creationfor } = req.body
        const superAdmin = req.user

        const checkAdmin = await UserModel.findOne({ email: email, isDeleted: false, role: 'admin' })
        if (checkAdmin) return res.status(400).json({ message: 'email already exist' })

        // const salt = await bcrypt.genSalt(5)
        // const hashPassword = await bcrypt.hash(String(password), salt)
        const newAdmin = await UserModel.create({
            adminId: superAdmin?.id,
            role: 'admin',
            name: name,
            contact: contact,
            creationfor: creationfor,
            email: email,
            password: password
        })
        await AuthUserModel.create({
            contact: contact,
            email: email,
            password: password,
            role: 'admin',
            refId: newAdmin._id
        })
        return res.status(200).json({
            message: "New Admin added successfully",
            status: 200,
            adminId: newAdmin._id
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });

    }
}

export const updateAdmin = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({ message: "admin id is required" });
        }

        const { name, email, password, contact } = req.body;
        const updatedData = {};

        if (name) updatedData.name = name;
        if (email) updatedData.email = email;
        if (contact) updatedData.contact = contact;
        if (password) updatedData.password = password;


        // Update both AuthUser and User documents parallelly
        const [authAdmin, userAdmin] = await Promise.all([
            AuthUserModel.findOneAndUpdate({ refId: id }, updatedData, { new: true }),
            UserModel.findOneAndUpdate({ _id: id }, updatedData, { new: true })
        ]);

        if (!authAdmin && !userAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        return res.status(200).json({
            message: "Admin updated successfully",
            data: {
                user: userAdmin
            }
        });
    } catch (error) {
        console.error("Update admin Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getAllAdmins = async (req, res) => {
    try {
        const admins = await UserModel.find({ isDeleted: false, role: 'admin' })
        return res.status(200).json({
            message: "Admin fetch successfully",
            status: 200,
            data: admins
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });

    }
}

export const deleteAdmin = async (req, res) => {
    try {

        const id = req.query.adminId
        if (!id) {
            return res.status(400).json({ message: "admin id is required" });
        }
        const result = await UserModel.findByIdAndUpdate(id, {
            isDeleted: true
        })
        if (!result) return res.status(400).json({ message: "admin not found" });

        return res.status(200).json({ message: "success", data: result });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });

    }
}

export const getAllHospital = async (req, res) => {

    try {
        const hosptials = await HospitalModel.find({ isDeleted: false })
            .populate({
                path: "supportedDepartments",
                populate: {
                    path: "doctorIds",
                },
            })
            .populate('medicalDirector')
            .populate('adminId')
            .populate("customLetterPad");

        return res.status(200).json({ message: 'success', data: hosptials })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' })

    }
}

export const hosptialMetrices = async (req, res) => {
    try {
        const [TotalHospital, TotalPatient, TotalPrescbrition, TotalRevenue, TopPerformanceHospital] = await Promise.all([
            HospitalModel.countDocuments({ isDeleted: false }),
            PatientModel.countDocuments({ isDeleted: false }),
            PersonalAssitantModel.countDocuments(),
            HospitalModel.aggregate([
                { $match: { isDeleted: false } },
                { $group: { _id: null, totalRevenue: { $sum: '$totalRevenue' } } }
            ]),
            HospitalModel.find({ isDeleted: false }).sort({ totalRevenue: -1 }).limit(10)

        ])
        return res.status(200).json({
            message: 'success', data: {
                "metrices": [
                    { key: "Total Hospital", value: TotalHospital },
                    { key: "Total Patient", value: TotalPatient },
                    { key: "Total Prescbrition", value: TotalPrescbrition },
                    { key: "Total Revenue", value: TotalRevenue[0]?.totalRevenue }
                ],
                TopPerformanceHospital
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' })

    }
}

export const allPatients = async (req, res) => {
    try {
        const patients = await PatientModel.find({ isDeleted: false }).populate('hospitalId doctorId')

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
