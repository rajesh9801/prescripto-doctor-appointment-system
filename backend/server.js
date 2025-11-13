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
  "http://localhost:5173",
  "http://localhost:5174",
  "https://prescripto-frontend-henna.vercel.app",
  "https://prescripto-admin-plum.vercel.app",
  "https://prescripto-admin-9vbqwxf9x-rajesh-kumars-projects-d030784c.vercel.app",
  "https://prescripto-frontend-3s56550b9-rajesh-kumars-projects-d030784c.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman / server-to-server

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("🚫 CORS blocked:", origin);
        callback(null, false);  // IMPORTANT: return false, DO NOT throw an error
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
