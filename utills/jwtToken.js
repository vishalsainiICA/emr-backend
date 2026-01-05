import jwt from "jsonwebtoken";
import AuthUserModel from "../models/authUserModel.js";
import UserModel from "../models/userModel.js";

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

        if (!email || !password) return res.status(400).json({ message: 'Invalid credentials' })
        const user = await UserModel.findOne({ email })
        if (!user) return res.status(400).json({ message: 'Email Not Found' })

        const isMatch = String(user?.password) === String(password)
        // console.log(isMatch);
        // console.log( String(user?.refId?.password));
        // console.log( String(password));

        if (!isMatch) return res.status(400).json({ message: 'Password is Incorrect' });

        const token = await generateToken({
            id: user?._id,
            name: user?.name,
            email: email,
        })

        return res.status(200).json({
            message: 'Login successful',
            role: user?.role,  // full profile is sent here
            token: token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

