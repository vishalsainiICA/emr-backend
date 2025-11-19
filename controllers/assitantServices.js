import InitialAssesment from "../models/initialAssessmentModel.js"
import PatientModel from "../models/patientModel.js";


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
        const patients = await PatientModel.find()
        return res.status(200).json({
            message: 'success', data: patients
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching patients" });
    }
}