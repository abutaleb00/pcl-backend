const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

/* ===============================
   CORS CONFIGURATION
================================ */

const allowedOrigins = [
   "http://localhost:3000",
   "http://127.0.0.1:3000",
   "http://localhost:5173",
];

app.use(
   cors({
      origin: function (origin, callback) {
         if (!origin) return callback(null, true);

         if (allowedOrigins.includes(origin)) {
            callback(null, true);
         } else {
            callback(new Error("Not allowed by CORS"));
         }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
   })
);

app.options("*", cors());

/* ===============================
   Core Middlewares
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 Cookie parser MUST be before routes
app.use(cookieParser());

/* ===============================
   Static Files
================================ */
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/* ===============================
   Routes
================================ */

app.use("/", require("./routes/sitemap.routes"));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));

app.use("/api/sliders", require("./routes/sliders.routes"));
app.use("/api/services", require("./routes/services.routes"));
app.use("/api/packages", require("./routes/packages.routes"));

app.use("/api/divisions", require("./routes/division.routes"));
app.use("/api/districts", require("./routes/district.routes"));
app.use("/api/upazilas", require("./routes/upazila.routes"));
app.use("/api/coverage", require("./routes/coverage.routes"));

app.use("/api/contact-info", require("./routes/contactInfo.routes"));
app.use("/api/inquiries", require("./routes/inquiry.routes"));

app.use("/api/blogs", require("./routes/blog.routes"));
app.use("/api/seo", require("./routes/seo.routes"));

/* ===============================
   Health Check
================================ */
app.get("/health", (req, res) => {
   res.json({ status: "OK", time: new Date() });
});

/* ===============================
   Global Error Handler
================================ */
app.use((err, req, res, next) => {
   if (err.message === "Not allowed by CORS") {
      return res.status(403).json({
         error: "CORS blocked this request",
         origin: req.headers.origin,
      });
   }

   console.error(err);
   res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
