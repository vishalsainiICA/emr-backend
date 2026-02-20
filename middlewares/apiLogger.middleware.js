import logger from "../utills/winston.js"

const requestLogger = (req, res, next) => {
    const start = Date.now();
    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress;
    res.on("finish", () => {
        // console.log("req", req);
        // console.log("data", req.message);

        logger.info({
            type: "API",
            requestId: req.requestId,
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            ip,
            responseTimeMs: Date.now() - start,
            userId: req.user?.id || null
        });


    })
    next()
}
export const auditLog = (data) => {
    console.log("auditLog", data);

    logger.warn({
        level: "audit",
        message: "Audit Event",
        action: data.action,
        module: data.module,
        userId: data.userId,
        oldData: data.oldData,
        newData: data.newData,
        ip: data.ip,
        requestId: data.requestId
    });
};



export default requestLogger;