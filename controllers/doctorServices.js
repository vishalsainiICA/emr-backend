
import IllnessModel from "../models/illnessModel.js";
import InitialAssesment from "../models/initialAssessmentModel.js";
import PatientModel from "../models/patientModel.js";
import UserModel from "../models/userModel.js";


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

export const todayPatient = async (req, res) => {
    try {
        const doctorId = "69087f721f9b6973874b8dd1" || req.user.id; // make sure req.user is set
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const [doctorProfile, todayPatient] = await Promise.all([
            UserModel.findById(doctorId).populate('hospitalId'),
            PatientModel.find({
                createdAt: { $gte: startOfDay, $lte: endOfDay },
                initialAssementId: { $ne: null }

            }).populate('initialAssementId'),
        ]);

        return res.status(200).json({
            message: 'success', data: {
                doctorProfile,
                todayPatient
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching today's patients" });
    }
};

export const getAllIllness = async (req, res) => {
    try {

        const illness = await IllnessModel.find()
        return res.status(200).json({
            message: 'success', data: illness
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching today's patients" });
    }
}

export const getAllPatientRecords = async (req, res) => {
    try {
        const patients = await PatientModel.find({ initialAssementId: { $ne: null } }).populate("initialAssementId")
        return res.status(200).json({
            message: 'success', data: patients
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching patients" });
    }
}

