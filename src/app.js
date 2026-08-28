const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Route imports
const authRoutes = require("./routes/authRoutes");
const actorRoutes = require("./routes/actorRoutes");
const producerRoutes = require("./routes/producerRoutes");
const movieRoutes = require("./routes/movieRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cookieParser());

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/actors", actorRoutes);
app.use("/api/producers", producerRoutes);
app.use("/api/movies", movieRoutes);

module.exports = app;
