import logger from "../utills/winston.js";

const errorHandler = (err, req, res, next) => {
    logger.error({
        type: "ERROR",
        requestId: req.requestId,
        method: req.method,
        url: req.originalUrl,
        message: err.message,
        stack: err.stack,
        userId: req.user?.id || null
    });

    return res.status(500).json({

        success: false,
        message: "Internal Server Error",
        requestId: req.requestId
    });
};

export default errorHandler;
