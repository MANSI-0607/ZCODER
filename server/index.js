const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

(async () => {
  try {
    await connectDB();

    app.use(helmet());
    app.use(cors({
      origin: "http://localhost:8080", // frontend origin
      credentials: true
    }));
    app.use(express.json());

    // Routes
   
    app.use("/api/auth", require("./routes/authRoutes"));
    app.use("/api/users", require("./routes/userRoutes")); 

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();
