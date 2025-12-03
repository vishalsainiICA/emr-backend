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
        const date = req.query?.date
        const status = req.query?.status
        const profile = await UserModel.findById(user?.id)
        let query = {
            doctorId: profile?.doctorId
        }

        console.log(req.query);


        if (date) {
            const selected = new Date(date);
            const start = selected.setHours(0, 0, 0, 0);
            const end = selected.setHours(23, 59, 59, 999)
            query.updatedAt = { $gte: start, $lte: end }
        }

        else if (status == "today") {

            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            query.updatedAt = { $gte: startOfDay, $lte: endOfDay }
        }
        else if (status === "postponed") {
            query.status = "Postponed"
        }

        else if (status === "cancel") {
            query.status = "Cancel"
        }

        else if (status === "all") {
        }


        else {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            query.updatedAt = { $gte: startOfDay, $lte: endOfDay }
        }

        const TodayPatient = await PatientModel.find(query)
            .sort({ updatedAt: -1 }) // latest first
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
        const profile =await  UserModel.findById(user.id)
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