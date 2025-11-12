import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
    try {
        // ✅ Get token from headers (prefer 'authorization' header)
        const token =
            req.headers.authorization?.split(" ")[1] || req.headers.atoken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, login again",
            });
        }

        // ✅ Verify and decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Check if payload matches your admin info
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        // Optionally attach admin info to request
        req.admin = decoded;

        next(); // ✅ Proceed to next middleware/controller
    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

export default authAdmin;
