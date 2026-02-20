import randomUUID from "crypto"

const requestLogger = (req, res, next) => {
    req.requestId = randomUUID(); // ONE TIME
    res.setHeader("X-Request-Id", req.requestId);
    next();
};
export default requestLogger;
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
