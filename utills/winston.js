import winston from "winston";
import "winston-mongodb";
import dotenv from "dotenv";

dotenv.config();

// Custom log levels
const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        audit: 3,
        debug: 4
    }
};

// Custom Format (DO NOT replace info object)
const customFormat = winston.format((info) => {
    info.timestamp = new Date().toISOString();
    info.level = info.level.toUpperCase();

    // I    f message is object, merge it properly
    if (typeof info.message === "object") {
        Object.assign(info, info.message);
        delete info.message;
    }

    return info;
});

// Logger
const logger = winston.createLogger({
    levels: customLevels.levels,
    level: "debug",
    format: winston.format.combine(
        customFormat(),
        winston.format.json()
    ),
    transports: [
        // ERROR LOGS
        new winston.transports.MongoDB({
            db: process.env.MONGO_URI,
            collection: "error_logs",
            level: "error"
        }),

        // API LOGS
        new winston.transports.MongoDB({
            db: process.env.MONGO_URI,
            collection: "api_logs",
            level: "info"
        })
    ]
});

export default logger;
