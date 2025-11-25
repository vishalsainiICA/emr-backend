import jwt from "jsonwebtoken";
import AuthUserModel from "../models/authUserModel.js";
import UserModel from "../models/userModel.js";
import PersonalAssitantModel from "../models/personalAssitantModel.js";

export const generateToken = (user) => {
    try {
        const payload = {
            id: user.id,
            email: user.email,
            name: user.name,
        };

        return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "7d" });
    } catch (error) {
        console.log(`Error generating token: ${error}`);
        return null;
    }
};

export const verifyToken = (req, res, next) => {
    try {
        const authHeaders = req.headers["authorization"];
        if (!authHeaders) {
            return res.status(400).json({
                message: "No token Provided",
            });
        }
        // "Bearer <token>"
        const token = authHeaders.split(" ")[1];

        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Invalid Token or Expired",
                });
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        console.log(`Error :${error}`);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};


export const login = async (req, res) => {
    try {
        const email = req.body?.email
        const password = req.body?.password

        console.log(req.body);


        if (!email || !password) return res.status(400).json({ message: 'Invalid credentials' })
        const user = await AuthUserModel.findOne({ email }).populate('refId');;
        if (!user) return res.status(400).json({ message: 'Email Not Found' })
        console.log(user);

        const isMatch = String(user?.refId?.password) === String(password)
        // console.log(isMatch);
        // console.log( String(user?.refId?.password));
        // console.log( String(password));

        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        let profile = null
        if (user?.role === "superadmin") {
            profile = await UserModel.findById(user?.refId)
        }
        else if (user?.role === "admin") {
            profile = await UserModel.findById(user?.refId)
        }
        else if (user?.role === "medicalDirector") {
            profile = await UserModel.findById(user?.refId)
        }
        else if (user?.role === "doctor") {
            profile = await UserModel.findById(user?.refId)
        }
        else if (user?.role === "personalAssitant") {
            profile = await UserModel.findById(user?.refId)
        }

        if (!profile) {
            return res.status(400).json({ message: 'Profile not found' });
        }

        const token = await generateToken({
            id: profile?._id,
            name: profile?.name,
            email: email,
        })

        return res.status(200).json({
            message: 'Login successful',
            role: profile?.role,  // full profile is sent here
            token: token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

