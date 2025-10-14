
import AuthUserModel from "../models/authUserModel.js";
import HospitalModel from "../models/hospital.js";
import UserModel from "../models/userModel.js";
import DepartmentModel from "../models/departmentModel.js";
import PatientModel from "../models/patientModel.js";



export const addHospital = async (req, res) => {
    try {
        const {
            name,
            city,
            state,
            pinCode,
            address,
            patientCategories,
            supportedDepartments,
            medicalDirector,
            customLetterPad
        } = req.body;

        const admin = req.user;

        console.log(admin);

        console.log(req.body);



        // Create Hospital
        const newHospital = await HospitalModel.create({
            adminId: admin?.id,
            name,
            city,
            state,
            pinCode,
            address,
            // medicalDirector: newMedicalDirector._id,
            // patientCategories: patientCategories || [],
            // supportedDepartments: departmentIds,
            // customLetterPad: customLetterPad,
        });

        // Create Medical Director
        const newMedicalDirector = await UserModel.create({
            name: medicalDirector.name,
            email: medicalDirector.email,
            password: medicalDirector.password,
            contact: medicalDirector.contact,
            licenseNo: medicalDirector.licenseNo,
            //signatureImage: medicalDirector.signatureImage,
            adminId: admin?.id,
            hospitalId: newHospital._id,
            role: 'medicalDirector'
        });

        // Create Auth User for Medical Director
        await AuthUserModel.create({
            email: newMedicalDirector.email,
            password: newMedicalDirector.password,
            contact: newMedicalDirector.contact,
            role: 'medicalDirector',
            refId: newMedicalDirector._id
        });

        //  Create Departments and Doctors
        const departmentIds = await Promise.all(
            supportedDepartments.map(async (dep) => {
                const doctorIds = await Promise.all(
                    (dep.doctorIds || []).map(async (doc) => {
                        const newDoctor = await UserModel.create({
                            name: doc.name,
                            email: doc.email,
                            password: doc.password,
                            contact: doc.contact,
                            licenseNo: doc.licenseNo,
                            adminId: admin?.id,
                            hospitalId: newHospital._id,
                            departmentName: dep?.departmentName,
                            role: 'doctor',
                            // signatureImage: doc.signatureImage,
                        });

                        await AuthUserModel.create({
                            email: doc.email,
                            password: doc.password,
                            contact: doc.contact,
                            role: 'doctor',
                            refId: newDoctor._id,
                        });
                        return newDoctor._id;
                    })
                );

                const newDepartment = await DepartmentModel.create({
                    departmentName: dep.departmentName || null,
                    doctorIds: doctorIds,
                    adminId: admin?.id,
                    hospitalId: newHospital._id,
                });

                return newDepartment._id;
            })
        );
        await HospitalModel.findByIdAndUpdate(newHospital._id, {
            hospitalId: newHospital._id,
            medicalDirector: newMedicalDirector._id,
            patientCategories: patientCategories || [],
            supportedDepartments: departmentIds,
            customLetterPad: customLetterPad,
            patientRegistrationLink: `${process.env.Frontend_LINK}/register/${newHospital._id}`

        });

        return res.status(200).json({
            message: "New hospital added successfully",
            hospitalId: newHospital._id
        });

    } catch (error) {
        console.error("Error in addHospital:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const addBranch = async (req, res) => {
    try {
        const {
            name,
            city,
            state,
            pinCode,
            address,
            patientCategories,
            supportedDepartments,
            medicalDirector,
            customLetterPad
        } = req.body;

        const admin = req.user;

        const id = req.query.hospitalId
        if (!id) return res.status(400).json({ message: 'hospital id is requried' })

        const hospital = await HospitalModel.findOne({ _id: id, isDeleted: false })
        if (!hospital) return res.status(400).json({ message: 'hospital not found' })


        // Create Hospital
        const newHospital = await HospitalModel.create({
            adminId: admin?._id,
            name,
            city,
            state,
            pinCode,
            address,
            // medicalDirector: newMedicalDirector._id,
            // patientCategories: patientCategories || [],
            // supportedDepartments: departmentIds,
            // customLetterPad: customLetterPad,
        });

        // Create Medical Director
        const newMedicalDirector = await UserModel.create({
            name: medicalDirector.name,
            email: medicalDirector.email,
            password: medicalDirector.password,
            contact: medicalDirector.contact,
            licenseNo: medicalDirector.licenseNo,
            signatureImage: medicalDirector.signatureImage,
            adminId: admin?.id,
            hospitalId: newHospital._id,
            role: 'medicalDirector'
        });

        // Create Auth User for Medical Director
        await AuthUserModel.create({
            email: newMedicalDirector.email,
            password: newMedicalDirector.password,
            contact: newMedicalDirector.contact,
            role: 'medicalDirector',
            refId: newMedicalDirector._id
        });

        //  Create Departments and Doctors
        const departmentIds = await Promise.all(
            supportedDepartments.map(async (dep) => {
                const doctorIds = await Promise.all(
                    (dep.doctor || []).map(async (doc) => {
                        const newDoctor = await UserModel.create({
                            name: doc.name,
                            email: doc.email,
                            password: doc.password,
                            contact: doc.contact,
                            licenseNo: doc.licenseNo,
                            adminId: admin?.id,
                            hospitalId: newHospital._id,
                            departmentName: dep?.departmentName,
                            role: 'doctor',
                            signatureImage: doc.signatureImage,
                        });

                        await AuthUserModel.create({
                            email: doc.email,
                            password: doc.password,
                            contact: doc.contact,
                            role: 'doctor',
                            refId: newDoctor._id,
                        });
                        return newDoctor._id;
                    })
                );

                const newDepartment = await DepartmentModel.create({
                    departmentName: dep.departmentName || null,
                    doctorIds: doctorIds,
                    adminId: admin?.id,
                    hospitalId: newHospital._id,
                });

                return newDepartment._id;
            })
        );
        await HospitalModel.findByIdAndUpdate(newHospital._id, {
            hospitalId: newHospital._id,
            medicalDirector: newMedicalDirector._id,
            patientCategories: patientCategories || [],
            supportedDepartments: departmentIds,
            customLetterPad: customLetterPad,
        });
        console.log(hospital);

        hospital.branches = []

        hospital.branches.push(newHospital._id)
        await hospital.save()

        return res.status(200).json({
            status: 200,
            message: "New branch added successfully",
            hospitalId: newHospital._id
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const findHospitalById = async (req, res) => {

    try {
        const id = req.query.hospitalId
        console.log(id);

        if (!id) return res.status(400).json({ message: 'hospital id is requried' })
        const hosptial = await HospitalModel.findOne({ _id: id, isDeleted: false }).populate({
            path: "supportedDepartments",
            populate: {
                path: "doctorIds",
            },
        }).populate('medicalDirector')

        return res.status(200).json({ message: 'success', data: hosptial })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' })

    }
}

export const updateHospital = async (req, res) => {

    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({ message: "hospital id is required" });
        }

        const { patientCategories, name, state, pinCode, city, address } = req.body

        // dynamic update object banate hain
        const updatedData = {};
        if (name) updatedData.name = req.body.name;
        if (city) updatedData.city = req.body.city;
        if (state) updatedData.state = req.body.state;
        if (pinCode) updatedData.pinCode = req.body.pinCode;
        if (address) updatedData.address = req.body.address;
        if (patientCategories) updatedData.patientCategories = req.body.patientCategories;


        // update query
        const hospital = await HospitalModel.findByIdAndUpdate(
            id,
            { $set: updatedData },
            { new: true } // updated document return karega
        );

        if (!hospital) {
            return res.status(404).json({ message: "hospital not found" });
        }

        return res.status(200).json({
            message: "hospital updated successfully",
            data: hospital
        });
    } catch (error) {
        console.error("Update Hospital Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteHospital = async (req, res) => {

    try {
        const id = req.query.id
        const hosptials = await HospitalModel.findByIdAndUpdate(id, {
            isDeleted: true
        })
        return res.status(200).json({ message: 'success', data: hosptials })

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })

    }
}

export const addSingleDepartment = async (req, res) => {
    console.log(req.body);

    try {
        const id = req.query.hospitalId;
        const admin = req.user;

        if (!id) return res.status(400).json({ message: 'Hospital ID is required' });

        const departmentData = req.body;
        if (!departmentData) {
            return res.status(400).json({ message: 'Department data is required' });
        }

        // Create doctors if any
        const doctorIds = await Promise.all(
            (departmentData.doctor || []).map(async (doc) => {
                const newDoctor = await UserModel.create({
                    name: doc.name,
                    email: doc.email,
                    password: doc.password,
                    contact: doc.contact,
                    licenseNo: doc.licenseNo,
                    adminId: admin?.id,
                    hospitalId: id,
                    role: 'doctor',
                    signatureImage: doc.signatureImage,
                });

                await AuthUserModel.create({
                    email: doc.email,
                    password: doc.password,
                    contact: doc.contact,
                    role: 'doctor',
                    refId: newDoctor._id,
                });

                return newDoctor._id;
            })
        );

        // Create the department
        const newDepartment = await DepartmentModel.create({
            departmentName: departmentData.departmentName || null,
            doctorIds: doctorIds,
            adminId: admin?.id,
            hospitalId: id,
        });

        // Update hospital with new department
        const hospital = await HospitalModel.findByIdAndUpdate(
            id,
            { $push: { supportedDepartments: newDepartment._id } },
            { new: true }
        );

        if (!hospital)
            return res.status(404).json({ message: 'Hospital not found' });

        return res.status(200).json({
            message: 'Department added successfully',
            data: { hospital, newDepartment },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

export const deleteSingleDepartment = async (req, res) => {
    try {
        const { hospitalId, depId } = req.query
        if (!hospitalId || !depId) return res.status(400).json({ message: 'hospital id  and depId is requried' })
        const hospital = await HospitalModel.findById(hospitalId)
        if (!hospital) return res.status(400).json({ message: 'hospital not found' })

        hospital.supportedDepartments = hospital.supportedDepartments.filter((dep) => dep._id.toString() !== depId.toString())
        await hospital.save()
        return res.status(200).json({ message: 'success', status: 200 })

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })

    }
}
export const updateSingleDepartment = async (req, res) => {
    try {
        const { hospitalId } = req.query
        const id = req.query.id
        if (!id) return res.status(400).json({ message: 'hospital id is requried' })
        const hospital = await HospitalModel.findByIdAndUpdate(id, { supportedDepartments: { $push: req.body } })
        if (!hospital) return res.status(400).json({ message: 'hospital not found' })
    } catch (error) {

    }
}

export const addSingleDoctor = async (req, res) => {
    try {
        const { hospitalId } = req.query
        const id = req.query.id
        if (!id) return res.status(400).json({ message: 'hospital id is requried' })
        const hospital = await HospitalModel.findByIdAndUpdate(id, { supportedDepartments: { $push: req.body } })
        if (!hospital) return res.status(400).json({ message: 'hospital not found' })
    } catch (error) {

    }
}
export const deleteSingleDoctor = async (req, res) => {
    try {

        const id = req.query.id
        if (!id) return res.status(400).json({ message: 'hospital id is requried' })
        const hospital = await HospitalModel.findByIdAndUpdate(id, { supportedDepartments: { $push: req.body } })
        if (!hospital) return res.status(400).json({ message: 'hospital not found' })
    } catch (error) {

    }
}
export const updateSingleDoctor = async (req, res) => {
    try {
        const { hospitalId } = req.query
        const id = req.query.id
        if (!id) return res.status(400).json({ message: 'hospital id is requried' })
        const hospital = await HospitalModel.findByIdAndUpdate(id, { supportedDepartments: { $push: req.body } })
        if (!hospital) return res.status(400).json({ message: 'hospital not found' })
    } catch (error) {

    }
}


export const registerPatient = async (req, res) => {
    console.log(req.body);
    // try {
    //     console.log(req.body);

    //     const { phone } = req.body.phone
    //     if (phone === '') {
    //         return res.status(400).json({
    //             message: 'please give phone number'
    //         })
    //     }
    //     const [lastPatient, existPhone, totalDoucment] = await Promise.all([
    //         PatientModel.findOne().sort({ index: -1 }),
    //         PatientModel.findOne({ phone: phone }),
    //         PatientModel.countDocuments(),
    //     ]);

    //     if (existPhone) {
    //         return res.status(409).json({
    //             success: false,
    //             message: "Phone Number Already Exist!"
    //         });
    //     }

    //     const newIndex = lastPatient ? lastPatient.index + 1 : 1;
    //     const patientUid = `${req.body.name.trim().slice(0, 3)}0${totalDoucment}`;

    //     const object = {
    //         index: newIndex,
    //         uid: patientUid,
    //         name: req.body.name,
    //         gender: req.body.gender,
    //         phone: req.body.phone,
    //         email: req.body.email,
    //         DOB: req.body.DOB,
    //         nationality: req.body.nationality,
    //         whatsApp: req.body.whatsApp,
    //         permanentAddress: req.body.permanentAddress,
    //         currentAddress: req.body.currentAddress,
    //         patientCategory: req.body.patientCategory,
    //         attendeeName: req.body.attendeeName,
    //         attendeePhone: req.body.attendeePhone,
    //         attendeeRelation: req.body.attendeeRelation,
    //         specialty: req.body.specialty,
    //         doctorId: req.body.doctorId,
    //         age: req.body.age,
    //         reports: req.savedFiles

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
