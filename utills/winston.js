import winston from "winston";
import "winston-mongodb";
import dotenv from "dotenv";

dotenv.config();
const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        audit: 3,
        debug: 4
    }
};
//Level Filter Function
const levelFilter = (level) => {
    return winston.format((info) => {
        return info.level === level ? info : false;
    })();
};


const logger = winston.createLogger({
    levels: customLevels.levels,
    level: "debug",

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),

    transports: [

        // ERROR LOGS
        new winston.transports.MongoDB({
            db: process.env.MONGO_URI,
            collection: "error_logs",
            format: levelFilter("error")
        }),

        //  API LOGS (only info)
        new winston.transports.MongoDB({
            db: process.env.MONGO_URI,
            collection: "api_logs",
            format: levelFilter("info")
        }),

        //AUDIT LOGS (only audit)
        // new winston.transports.MongoDB({
        //     db: process.env.MONGO_URI,
        //     collection: "audit_logs",
        //     format: levelFilter("warn")
        // })

    ]
});

export default logger;
