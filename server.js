const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");
const learningRoutes = require("./routes/learningRoutes");
const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");
// const progressRoutes = require("./routes/progressRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const employeeVerificationRoutes = require('./routes/employeeVerificationRoutes');
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
// const courseRoutes = require("./routes/courseRoutes");
// const moduleRoutes = require("./routes/moduleRoutes");

const app = express();
const path = require("path");

app.use(
  cors({
    origin: "https://fairsay.onrender.com",
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
// app.use("/api/users", progressRoutes);

app.use("/api/ai", aiRoutes);
app.use('/api/verification', employeeVerificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/notifications", notificationRoutes);
// app.use("/api/courses", courseRoutes);

app.get("/", (req, res) => {
  res.send("FairSay API Running");
});

// app.use("/api/modules", moduleRoutes);


// // Serve frontend build
// app.use(express.static(path.join(__dirname, "../frontend/dist")));

// app.get(/.*/, (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
// });

// Health / Ping Endpoint
app.get("/ping", (req, res) => {
  res.status(200).send("OK");
});

// app.get("/debug-db", async (req, res) => {
//   try {
//     const [rows] = await db.query("SELECT DATABASE() as db");
//     res.json(rows);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// GLOBAL ERROR HANDLER
// app.use((err, req, res, next) => {
//   console.error("GLOBAL ERROR HANDLER:", err);

//   res.status(err.status || 500).json({
//     message: err.message || "Server Error"
//   });
// });