import PatientModel from "../models/patientModel.js";
import InitialAssesment from "../models/initialAssessmentModel.js";
import PrescribtionModel from "../models/prescribtionModel.js";

export const saveInitialAssessments = async (req, res) => {

    try {
        const { uid } = req.body
        if (!uid) {
            return res.status(400).json({ message: 'patientId is required' })
        }
        const checkPatient = await PatientModel.findOne({ uid })

        if (!checkPatient) {
            return res.status(404).json({ message: 'patient is not found' })
        }
        const patientAssement = await InitialAssesment({
            patientId: checkPatient._id,
            uid: req.body.uid,
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
        if (patientAssement) {
            return res.status(200).json({
                success: true,
                message: "Assessment Save Successfully!"
            })
        }
    } catch (error) {
        console.log('while Initial Assessments', error);
    }
}

export const savePrescribtionData = async (req, res) => {
    try {
        const { patientId, doctorId, initialAssesmentId } = req.body
        // if (!uid) {
        //     return res.status(400).json({ message: 'patientId is required' })
        // }
        // const checkPatient = await PatientModel.findOne({ uid })

        // if (!checkPatient) {
        //     return res.status(404).json({ message: 'patient is not found' })
        // }

        const newPrescribtion = PrescribtionModel(req.body)
        await newPrescribtion.save()
        return res.status(200).json({ message: 'save successfully' })
    } catch (error) {
        console.log('while Initial Assessments', error);
    }
}

export const verifyUId = async (req, res) => {
    console.log(req.query);
    // const patient = await PatientModel.find()
    // console.log(patient);


    try {

        const { uid, patientId } = req.query
        if (!uid) {
            return res.status(400).json({ message: 'uidis required' })
        }

        const checkPatient = await PatientModel.findOne({})

        if (!checkPatient) {
            return res.status(404).json({ message: 'patient is not found' })
        }

        if (checkPatient?.uid === uid) {
            return res.status(200).json({ message: 'uid is match' })
        }
        return res.status(400).json({ message: 'uid is not match' })

    } catch (error) {
        console.log(`Error${error}`);
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}
export const registerPatient = async (req, res) => {
    try {
        console.log(req.body);

        const { phone } = req.body.phone
        if (phone === '') {
            return res.status(400).json({
                message: 'please give phone number'
            })
        }
        const [lastPatient, existPhone, totalDoucment] = await Promise.all([
            PatientModel.findOne().sort({ index: -1 }),
            PatientModel.findOne({ phone: phone }),
            PatientModel.countDocuments(),
        ]);

        if (existPhone) {
            return res.status(409).json({
                success: false,
                message: "Phone Number Already Exist!"
            });
        }

        const newIndex = lastPatient ? lastPatient.index + 1 : 1;
        const patientUid = `${req.body.name.trim().slice(0, 3)}0${totalDoucment}`;

        const object = {
            index: newIndex,
            uid: patientUid,
            name: req.body.name,
            gender: req.body.gender,
            phone: req.body.phone,
            email: req.body.email,
            DOB: req.body.DOB,
            nationality: req.body.nationality,
            whatsApp: req.body.whatsApp,
            permanentAddress: req.body.permanentAddress,
            currentAddress: req.body.currentAddress,
            patientCategory: req.body.patientCategory,
            attendeeName: req.body.attendeeName,
            attendeePhone: req.body.attendeePhone,
            attendeeRelation: req.body.attendeeRelation,
            specialty: req.body.specialty,
            doctorId: req.body.doctorId,
            age: req.body.age,
            reports: req.savedFiles

        };
        const newPatient = new PatientModel(object);
        await newPatient.save();

        return res.status(200).json({
            success: true,
            message: "User Registered Successfully",
            data: newPatient
        });
    } catch (error) {
        console.error("Error while Registering Patient:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const getAllPatients = async (req, res) => {
    try {

        const patients = await PatientModel.find()
        return res.status(200).json({
            message: 'patients fetched',
            data: patients,
            status: 200
        })
    } catch (error) {
        console.log(`Error ${error}`);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500
        })


    }
}
export const getAllPatientsAssement = async (req, res) => {
    try {
        const assessments = await InitialAssesment.find({
            patientId: { $exists: true }
        }).populate('patientId')
        return res.status(200).json({
            message: 'patients fetched',
            data: assessments,
            status: 200
        })
    } catch (error) {
        console.log(`Error ${error}`);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500
        })

    }
}