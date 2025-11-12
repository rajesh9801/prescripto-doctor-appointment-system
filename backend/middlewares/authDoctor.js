import jwt from "jsonwebtoken";

const authDoctor = (req, res, next) => {
  try {
    let token = req.headers["dtoken"] || req.headers["authorization"];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Please login again.",
      });
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach doctor ID directly
    req.docId = decoded.id;

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized or invalid token",
    });
  }
};

export default authDoctor;
