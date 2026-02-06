import ip from "ip";
import redis from "./redis.js"

const MAX_API_LIMIT = 15; // max requests
const MAX_TIME = 30;      // seconds

const handleApiLimit = async (req, res, next) => {
    try {
        //client IP (real user)
        const userIp =
            ip.address() ||
            req.headers["x-forwarded-for"]?.split(",")[0] ||
            req.socket.remoteAddress ||
            req.ip;

        const key = `rate_limit:${userIp}`;

        // 🔹 increment request count
        const requests = await redis.incr(key);

        // 🔹 first request → set expiry
        if (requests === 1) {
            await redis.expire(key, MAX_TIME);
        }

        // 🔹 limit exceeded
        if (requests > MAX_API_LIMIT) {
            return res.status(429).json({
                message: "Too many requests",
            });
        }
        next();
    } catch (error) {
        console.error("Rate limit error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default handleApiLimit;
