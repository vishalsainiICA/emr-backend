import InitialAssessment from "../models/initialAssessmentModel.js"
import PatientModel from "../models/patientModel.js";
import UserModel from "../models/userModel.js";


export const saveInitialAssessment = async (req, res) => {
    try {
        const { patientId, initialAssessment } = req.body;
        console.log(req.body);


        if (!patientId || !initialAssessment) {
            return res.status(400).json({
                success: false,
                message: "patientId and initialAssessment are required"
            });
        }

        const assessment = await InitialAssessment.create({
            patientId,

            vitals: {
                bp: initialAssessment?.vitals?.bp || "",
                heartRate: initialAssessment?.vitals?.heartRate || "",
                temperature: initialAssessment?.vitals?.temperature || "",
                respRate: initialAssessment?.vitals?.respRate || "",
                spo2: initialAssessment?.vitals?.spo2 || "",
                weight: initialAssessment?.vitals?.weight || "",
                height: initialAssessment?.vitals?.height || "",
                bloodgroup: initialAssessment?.vitals?.bloodgroup || ""

            },

            complaint: initialAssessment?.complaint || "",
            medicalHistory: initialAssessment?.medicalHistory || "",
            physicalExam: initialAssessment?.physicalExam || "",
            notes: initialAssessment?.notes || "",

            selectedSym: initialAssessment?.selectedSym || [],

            createdBy: req.user?._id
        });

        const updated = await PatientModel.findByIdAndUpdate(patientId, {
            $set: {
                initialAssementId: assessment._id,
                status: "Assessment Done"
            }
        })
        console.log("Updaed", updated);


        if (updated) {
            return res.status(200).json({
                success: true,
                message: "Initial assessment saved successfully",
                data: assessment
            });
        }

        return res.status(201).json({
            success: true,
            message: "Initial assessment saved successfully But Not Attach To Patient",
            data: assessment
        });
    } catch (error) {
        console.error("Save Assessment Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getWitNoAssessmentPatient = async (req, res) => {
    try {
        const user = req.user;
        const { date, status } = req.query;

        if (!user?.id) {
            return res.status(400).json({ message: "Invalid user" });
        }

        // Base query
        let query = { registerarId: user.id, initialAssementId: { $eq: null }, currentPrescriptionId: { $eq: null } };
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Handle date filter
        if (date) {
            const selected = new Date(date);
            const start = new Date(selected.setHours(0, 0, 0, 0));
            const end = new Date(selected.setHours(23, 59, 59, 999));
            query.updatedAt = { $gte: start, $lte: end };
        }
        else if (status === "today") {
            query.updatedAt = { $gte: startOfDay, $lte: endOfDay };
        }
        else if (status === "postponed") {
            query.status = "Postponed";
        }
        else if (status === "cancel") {
            query.status = "Cancel";
        }
        // status === "all" → no extra filter

        // Fetch patients with population
        const [patients, todayPatients, pendingAssessment, totalPatient] = await Promise.all([
            PatientModel.find(query)
                .populate("initialAssementId")
                .populate({
                    path: "treatmentHistory",
                    populate: [
                        { path: "doctorId", model: "userModel" },
                        { path: "prescriptionId", model: "prescribtion" },
                        { path: "initialAssementId", model: "initialassessment" },
                    ],
                })
                .sort({ updatedAt: -1 }),
            PatientModel?.countDocuments({ registerarId: user.id, createdAt: { $gte: startOfDay, $lte: endOfDay } }),
            PatientModel?.countDocuments({ registerarId: user.id, initialAssementId: { $eq: null } }),
            PatientModel?.countDocuments({ registerarId: user.id }),

        ])

        // Metrics
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        // console.log("todaypatuent", todayPatients);


        return res.status(200).json({
            message: "success",
            data: patients,
            metrices: {
                todayPatient: todayPatients,
                pendingAssessment: pendingAssessment,
                patientRecord: totalPatient,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching patients", error });
    }
};

export const getAllPatientRecords = async (req, res) => {
    try {
        const user = req.user;
        const { startDate, endDate, status } = req.query;

        let query = {
            registerarId: user?.id,
            currentPrescriptionId: { $ne: null }
        };

        //  Date range filter
        if (startDate && endDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);

            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            query.updatedAt = { $gte: start, $lte: end };
        }

        // Status filters
        if (status === "today") {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            query.updatedAt = { $gte: startOfDay, $lte: endOfDay };
        }

        if (status === "postponed") {
            query.status = "Postponed";
        }

        if (status === "cancel") {
            query.status = "Cancel";
        }

        const patients = await PatientModel.find(query)
            .populate("initialAssementId currentPrescriptionId")
            .populate({
                path: "treatmentHistory",
                populate: [
                    { path: "doctorId", model: "userModel" },
                    { path: "prescriptionId", model: "prescribtion" },
                    { path: "initialAssementId", model: "initialassessment" }
                ]
            })
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            message: "success",
            data: patients
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching patients" });
    }
};

export const getAssessmentPatients = async (req, res) => {
    try {
        const user = req.user;
        let query = {
            registerarId: user?.id,
        };

        const patients = await PatientModel.find(query)
            .populate("initialAssementId currentPrescriptionId")
            .populate({
                path: "treatmentHistory",
                populate: [
                    { path: "doctorId", model: "userModel" },
                    { path: "prescriptionId", model: "prescribtion" },
                    { path: "initialAssementId", model: "initialassessment" }
                ]
            })
            .sort({ updatedAt: -1 })


        return res.status(200).json({
            message: "success",
            data: patients
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

export const editProfile = async (req, res) => {

    try {
        const user = req.user
        const { name, email, contact, oldPassword, newPassword } = req.body;

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
        if (updated) return res.status(200).json({ message: "Success", data: updated });
        else return res.status(400).json({ message: "Error Update in Document", data: updated });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" });

    }
}
export const registerPatient = async (req, res) => {
    console.log(req.files);

    // try {
    //     const { phone, hospitalId } = req.body
    //     const user = req.user
    //     if (phone === '') {
    //         return res.status(400).json({
    //             message: 'please give phone number'
    //         })


    //     }

    //     const [totalDocument, existPhone] = await Promise.all([
    //         PatientModel.countDocuments({ hospitalId: hospitalId }),
    //         PatientModel.findOne({ phone: phone })
    //     ]);

    //     // if (existPhone) {
    //     //     return res.status(409).json({
    //     //         success: false,
    //     //         message: "Phone Number Already Exist!"
    //     //     });
    //     // }
    //     const patientUid = `${req.body.name.trim().slice(0, 4).toUpperCase()}${totalDocument}`.trim();
    //     const categories = req.body.categories;
    //     const counts = req.body.fileCount;
    //     const files = req.files?.documents;
    //     const addharfrontPath = req.files?.addharfront[0].path.replace(/\\/g, "/")
    //     const addharbackPath = req.files?.addharback[0].path.replace(/\\/g, "/")

    //     let finalData = []
    //     let index = 0;
    //     for (let i = 0; i < categories?.length; i++) {
    //         const category = categories[i];
    //         const count = parseInt(counts[i]);

    //         let catFiles = [];

    //         for (let j = 0; j < count; j++) {
    //             catFiles.push({
    //                 path: files[index].path.replace(/\\/g, "/"),
    //             });
    //             index++;
    //         }

    //         finalData.push({
    //             category,
    //             files: catFiles
    //         });
    //     }

    //     const object = {
    //         doctorId: req.body.doctorId,
    //         hospitalId: req.body?.hospitalId || null,
    //         uid: patientUid.trim(),
    //         name: req.body?.name,
    //         gender: req.body?.gender,
    //         phone: req.body?.phone,
    //         email: req.body?.email,
    //         DOB: req.body?.DOB,
    //         nationality: req.body?.nationality,
    //         whatsApp: req.body?.whatsApp,
    //         permanentAddress: req.body?.permanentAddress,
    //         currentAddress: req.body?.currentAddress,
    //         patientCategory: req.body?.patientCategory ? JSON.parse(req.body?.patientCategory) : null,
    //         attendeeName: req.body?.attendeeName,
    //         attendeePhone: req.body?.attendeePhone,
    //         attendeeRelation: req.body?.attendeeRelation,
    //         specialty: req.body?.specialty,
    //         city: req.body?.city,
    //         state: req.body?.state,
    //         registerarId: user.id,
    //         addharDocumnets: {
    //             addharfrontPath,
    //             addharbackPath
    //         },
    //         age: req.body?.age,
    //         pastDocuments: finalData


    //     };
    //     const newPatient = new PatientModel(object);
    //     await newPatient.save();
    //     return res.status(200).json({
    //         success: true,
    //         message: "User Registered Successfully",
    //         data: newPatient
    //     });
    // } catch (error) {
    //     console.error("Error while Registering Patient:", error);
    //     return res.status(500).json({
    //         success: false,
    //         message: "Internal Server Error",
    //         error: error.message
    //     });
    // }
};


export const dailyActivity = async (req, res) => {
    try {
        const user = req.user;
        // today rangeU
        const profile = await UserModel.findById(user.id)
        console.log(profile);

        if (!profile) return res.status(400).json({ "message": "user not found" })
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
                doctorId: profile?.doctorId,
                updatedAt: { $gte: startOfDay, $lte: endOfDay },
            })
                .sort({ updatedAt: -1 }), // latest first

            PatientModel.find({
                doctorId: profile?.doctorId,
                updatedAt: { $gte: startOfDay, $lte: endOfDay },
                prescribtionId: { $ne: null }
            })
                .sort({ updatedAt: -1 }),// latest first

            PatientModel.find({
                doctorId: profile?.doctorId,
                updatedAt: { $gte: startOfDay, $lte: endOfDay },
                status: "Postponed"
            })
                .sort({ updatedAt: -1 }),// latest first
            PatientModel.find({
                doctorId: profile?.doctorId,
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