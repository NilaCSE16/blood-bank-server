const express = require("express");
require("dotenv").config();
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const port = process.env.PORT || 5000;

const path = require("path");

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//mongodb connections
connectDB();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Blood bank app" });
});

app.get("/favicon.ico", () => {
  res.send("Favicon");
});

app.use("/api/", require("./routes/testRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
// app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

//static Folder
app.use(express.static(path.join(__dirname, "../client/build")));

//static route
app.get("*", function (req, res) {
  res.sendFile(__dirname, "/index.html");
});

app.listen(port, () => {
  console.log(
    `Server is running in ${process.env.DEV_MODE} mode on port: ${port}`.bgBlue
      .white
  );
});
