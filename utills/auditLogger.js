const logger = require("./winston.js")

module.exports.auditLog = ({
    action,
    module,
    userId,
    oldData,
    newData,
    ip,
    requestId
}) => {
    logger.info({
        type: "AUDIT",
        action,
        module,
        userId,
        requestId,
        ip,
        oldData,
        newData
    });
};
