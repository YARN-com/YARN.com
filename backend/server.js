const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const threadsRoutes = require("./routes/threads");
const strandsRoutes = require("./routes/strands");

app.use("/api/threads", threadsRoutes);
app.use("/api/strands", strandsRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to YARN.com - Community Story Threads API" });
});

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/yarn-community-threads";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
