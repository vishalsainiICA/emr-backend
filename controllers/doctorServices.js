
import status from "statuses";
import IllnessModel from "../models/illnessModel.js";
import InitialAssesment from "../models/initialAssessmentModel.js";
import PatientModel from "../models/patientModel.js";
import PrescribtionModel from "../models/prescribtionModel.js";
import UserModel from "../models/userModel.js";


export const getProfile = async (req, res) => {
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
        const user = req.user;
        // today range
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const [
            TodayPatient,
            TotalPatient,
            TotalPrescrition,
            CancelPatient
        ] = await Promise.all([
            // Today Patients
            PatientModel.find({
                doctorId: user?.id,
                createdAt: { $gte: startOfDay, $lte: endOfDay },
                initialAssementId: { $ne: null }
            })
                .sort({ createdAt: -1 }) // latest first
                .populate('initialAssementId'),

            // Total Patients
            PatientModel.countDocuments({ doctorId: user?.id }),

            // Total Prescriptions
            PatientModel.countDocuments({ doctorId: user?.id, prescribtionId: { $ne: null } }),

            // Cancelled Patients
            PatientModel.countDocuments({ doctorId: user?.id, status: "Cancel" })
        ]);


        res.status(200).json({
            message: "success",
            data: TodayPatient,
            metrices: {
                TodayPatient: TodayPatient?.length,
                TotalPatient,
                TotalPrescrition,
                CancelPatient,

            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching patients" });
    }
};

export const savePrescribtion = async (req, res) => {
    try {
        const obj =
        {
            "patientId": req.body.patientId,
            "initialAssementId": req.body.initialAssementId,
            "doctorId": req.body.doctorId,
            "hospitalId": req.body.hospitalId,
            "prescriptionType": req.body.prescriptionType,
            "prescriptionMediciene": req.body.prescriptionMediciene,
            "illness": req.body.illness,
            "symptoms": req.body.symptoms,
            "labTest": req.body.labTest,
            "prescriptionImage": req.file.path.replace(/\\/g, "/"),
        }

        const pris = await PrescribtionModel.create(obj)

        const result = await PatientModel.findByIdAndUpdate(req.body.patientId, {
            $set: {
                prescribtionId: pris._id
            }
        }, {
            new: true
        })

        if (result) {
            return res.status(200).json({
                message: 'success', data: result
            })
        }
        else {
            return res.status(300).json({
                message: 'Kindly Data not Updated'
            })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const changePatientStatus = async (req, res) => {
    try {
        const { id, newDate, cancelReason } = req.body;

        if (!id) {
            return res.status(400).json({ message: "id is required" });
        }

        let updateFields = {};

        //  If user is postponing appointment (date change)
        if (newDate) {
            updateFields.createdAt = new Date(newDate);  // Always convert to JS Date
            updateFields.status = "Postponed";           // optional
        }

        // If user is cancelling appointment
        if (cancelReason) {
            updateFields.status = "Cancel";             // update status
            updateFields.cancelReason = cancelReason;   // save reason
        }

        const updatedPatient = await PatientModel.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        );

        if (!updatedPatient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        return res.status(200).json({
            message: "success",
            data: updatedPatient
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

