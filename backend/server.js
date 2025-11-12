import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

// App config
const app = express();
const port = process.env.PORT || 4000;

// Database connection
connectDB();

// ✅ CORS setup for local + production
const allowedOrigins = [
  "http://localhost:5173",      // local frontend (Vite default)
  "http://localhost:5174",      // local admin (if run on another port)
  "https://prescripto-frontend-henna.vercel.app", // deployed frontend
  "https://prescripto-admin-plum.vercel.app"       // deployed admin
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// API routes
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

// Default route
app.get("/", (req, res) => {
  res.send("API working successfully 🚀");
});

// Start the server
app.listen(port, () => console.log(`✅ Server running on port: ${port}`));
