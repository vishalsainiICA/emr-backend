import InitialAssesment from "../models/initialAssessmentModel.js";
import PatientModel from "../models/patientModel.js";

export const getPatientsForDoctor = async (req, res) => {
    try {
        const patient = await PatientModel.find({ doctorId: req.params.id });
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Invalid Doctor!"
            });
        }
        else {
            return res.status(200).json({
                success: true,
                message: "Patient Fetched!",
                patient
            })
        }
    } catch (error) {
        console.log("while Feting Patient", error);
    }
}
export const emrMatrix = async (req, res) => {

    try {

        let pendingLabReports = null
        let followUpsDue = null


        const [totalPatients, todayAppointments] = await Promise.all([
            PatientModel.find()
        ])

    } catch (error) {

    }
}