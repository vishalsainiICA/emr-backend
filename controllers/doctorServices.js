
import status from "statuses";
import IllnessModel from "../models/illnessModel.js";
import PatientModel from "../models/patientModel.js";
import PrescribtionModel from "../models/prescribtionModel.js";
import UserModel from "../models/userModel.js";
import HospitalModel from "../models/hospital.js";
import AuthUserModel from "../models/authUserModel.js";


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
export const editProfile = async (req, res) => {

    try {
        const user = req.user
        const { name, email, contact, oldPassword, newPassword } = req.body;

        console.log(req.body);

        const profile = await UserModel.findById(user?.id)
        if (!profile) return res.status(404).json({ message: "user not found" });

        if (oldPassword) {
            if (oldPassword !== profile.password) return res.status(402).json({ message: "Incorrect Password" });
        }
        const updated = await UserModel.findByIdAndUpdate(profile._id, {
            $set: {
                name: name || profile.name,
                email: email || profile.email,
                contact: contact || profile.contact,
                password: newPassword
            }
        }, {
            new: true
        })
        const updatedData = await AuthUserModel.findOneAndUpdate(
            { refId: user?.id },
            {
                $set: {
                    email: email || profile.email,
                    contact: contact || profile.contact,
                    ...(newPassword && { password: newPassword })   // only update if new password exists
                }
            },
            { new: true }
        );

        if (updatedData) return res.status(200).json({ message: "Success", data: updatedData });

        else return res.status(400).json({ message: "Error Update in Document", data: updatedData });
    } catch (error) {
        console.log(error)
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
                updatedAt: { $gte: startOfDay, $lte: endOfDay },
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
        const date = req.query?.date;
        const status = req.query?.status;

        let query = {
            doctorId: user?.id
        };

        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setHours(23, 59, 59, 999);

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

            query.updatedAt = { $gte: start, $lte: end };
            query.initialAssementId = { $ne: null };
        }

        // 🔹 3) STATUS = POSTPONED
        else if (status === "postponed") {
            query.status = "Postponed";
        }

        // 🔹 4) STATUS = CANCEL
        else if (status === "cancel") {
            query.status = "Cancel";
        }

        // 🔹 5) STATUS = ALL → no extra filter
        else if (status === "all") { }

        // 🔹 6) DEFAULT → TODAY
        else {
            const start = new Date();
            start.setHours(0, 0, 0, 0);

            const end = new Date();
            end.setHours(23, 59, 59, 999);

            query.updatedAt = { $gte: start, $lte: end };
            query.initialAssementId = { $ne: null };
        }

        const [
            TodayPatient,
            TodayPatients,
            TotalMalepatient,
            TotalFemalepatient,
            TotalPrescrition,
            CancelPatient
        ] = await Promise.all([

            PatientModel.find(query)
                .sort({ updatedAt: -1 })
                .populate("initialAssementId"),

            PatientModel.countDocuments({
                updatedAt: { $gte: start, $lte: end },
                initialAssementId: { $ne: null }
            }),
            PatientModel.countDocuments({
                isDeleted: false,
                doctorId: user?.id,
                gender: { $regex: "^male$", $options: "i" }
            }),

            PatientModel.countDocuments({
                isDeleted: false,

                doctorId: user?.id,
                gender: { $regex: "^female$", $options: "i" }
            }),

            PatientModel.countDocuments({
                doctorId: user?.id,
                prescribtionId: { $ne: null }
            }),

            PatientModel.countDocuments({
                doctorId: user?.id,
                status: "Cancel"
            })
        ]);

        res.status(200).json({
            message: "success",
            data: TodayPatient,
            metrices: {
                TodayPatient: TodayPatients,
                TotalMalepatient,
                TotalFemalepatient,
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
        const {
            hospitalId,
            patientId,
            doctorId,
            initialAssementId,
            prescriptionType,
            prescriptionMediciene,
            illness,
            symptoms,
            labTest
        } = req.body;

        if (!hospitalId || !patientId || !doctorId) {
            return res.status(400).json({
                message: "Required fields missing: hospitalId, patientId, doctorId"
            });
        }

        // check file upload
        const prescriptionImage = req.file?.path
            ? req.file.path.replace(/\\/g, "/")
            : null;

        const doctorProfile = await UserModel.findById(doctorId);
        if (!doctorProfile) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const doctorFee = doctorProfile.appointmentFees || 0;

        // payload object
        const obj = {
            patientId,
            initialAssementId,
            doctorId,
            hospitalId,
            prescriptionType,
            prescriptionMediciene,
            illness,
            symptoms,
            labTest,
            prescriptionfees: doctorFee,
            prescriptionImage
        };

        // 1. Create prescription
        const prescription = await PrescribtionModel.create(obj);

        // 2. Update patient
        const updatedPatient = await PatientModel.findByIdAndUpdate(
            patientId,
            { $set: { prescribtionId: prescription._id } },
            { new: true }
        );

        if (!updatedPatient) {
            return res.status(400).json({ message: "Patient update failed" });
        }

        // 3. Update hospital stats in one go
        const hosptial = await HospitalModel.findByIdAndUpdate(
            hospitalId,
            {
                $inc: {
                    totalPrescribtion: 1,
                    totalRevenue: Number(doctorFee) || 0
                }
            },
            { new: true }
        );

        console.log(hosptial);


        return res.status(200).json({
            message: "Success",
            data: updatedPatient
        });

    } catch (error) {
        console.error("savePrescribtion Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const dailyActivity = async (req, res) => {
    try {
        const user = req.user;
        // today range
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const [
            UserRegister,
            TodayPriscribtion,
            PostponedPatient,
            CancelPatient
        ] = await Promise.all([
            // Today Patients
            PatientModel.find({
                doctorId: user?.id,
                updatedAt: { $gte: startOfDay, $lte: endOfDay },
            })
                .sort({ updatedAt: -1 }), // latest first

            PatientModel.find({
                doctorId: user?.id,
                updatedAt: { $gte: startOfDay, $lte: endOfDay },
                prescribtionId: { $ne: null }
            })
                .sort({ updatedAt: -1 }),// latest first

            PatientModel.find({
                doctorId: user?.id,
                updatedAt: { $gte: startOfDay, $lte: endOfDay },
                status: "Postponed"
            })
                .sort({ updatedAt: -1 }),// latest first
            PatientModel.find({
                doctorId: user?.id,
                updatedAt: { $gte: startOfDay, $lte: endOfDay },
                status: "Cancel"
            })
                .sort({ updatedAt: -1 }) // latest first
        ]);

        let merged = [
            ...UserRegister,
            ...TodayPriscribtion,
            ...PostponedPatient,
            ...CancelPatient
        ];

        // SORT by time (latest first)
        merged.sort((a, b) => new Date(b.time) - new Date(a.time));


        res.status(200).json({
            message: "success",
            data: merged
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
