import InitialAssesment from "../models/initialAssessmentModel.js"
import PatientModel from "../models/patientModel.js";
import UserModel from "../models/userModel.js";


export const saveInitialAssessments = async (req, res) => {

    try {

        const patientId = req?.query?.patientId

        const checkPatient = await PatientModel.findById(patientId)

        if (!checkPatient) {
            return res.status(404).json({ message: 'patient is not found' })
        }
        const patientAssement = await InitialAssesment({
            patientId: patientId,
            uid: checkPatient.uid,
            height: req.body.height,
            weight: req.body.weight,
            BP: req.body.BP,
            bloodGroup: req.body.bloodGroup,
            o2: req.body.o2,
            heartRate: req.body.heartRate,
            sugar: req.body.sugar,
            hemoglobin: req.body.hemoglobin,
            bodyTempreture: req.body.bodyTempreture,
            respiratoryRate: req.body.respiratoryRate,

        });
        await patientAssement.save();
        const updatedPatient = await PatientModel.findByIdAndUpdate(patientId, {
            $set: {
                initialAssementId: patientAssement._id
            }
        }, { new: true })
        if (updatedPatient) {
            return res.status(200).json({
                success: true,
                message: "Assessment Save Successfully!"
            })
        }
    } catch (error) {
        console.log('while Initial Assessments', error);
    }
}

export const getAllPatientRecords = async (req, res) => {
    try {
        const user = req.user;
        // today range
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const profile = await UserModel.findById(user?.id)

        const TodayPatient = await PatientModel.find({
            doctorId: profile?.doctorId,
            createdAt: { $gte: startOfDay, $lte: endOfDay },
        })
            .sort({ createdAt: -1 }) // latest first
            .populate('initialAssementId')

        res.status(200).json({
            message: "success",
            data: TodayPatient,

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching patients" });
    }
};

export const getProfile = async (req, res) => {
    console.log(req.user);
    try {
        const user = req.user
        const profile = await UserModel.findById(user?.id).populate("doctorId")
        if (!profile) return res.status(404).json({ message: "user not found" });

        return res.status(200).json({ message: "Success", data: profile });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });

    }
}