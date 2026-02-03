const express = require("express");
const path = require("path");

const app = express();

/* ===============================
   Middlewares
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===============================
   Static Files
================================ */
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/* ===============================
   Routes
================================ */

// Sitemap (root level)
app.use("/", require("./routes/sitemap.routes"));

// Auth
app.use("/api/auth", require("./routes/auth.routes"));

// Home / CMS
app.use("/api/sliders", require("./routes/sliders.routes"));
app.use("/api/services", require("./routes/services.routes"));
app.use("/api/packages", require("./routes/packages.routes"));

// Coverage
app.use("/api/divisions", require("./routes/division.routes"));
app.use("/api/districts", require("./routes/district.routes"));
app.use("/api/upazilas", require("./routes/upazila.routes"));
app.use("/api/coverage", require("./routes/coverage.routes"));

// Contact & Inquiry
app.use("/api/contact-info", require("./routes/contactInfo.routes"));
app.use("/api/inquiries", require("./routes/inquiry.routes"));

// Blog
app.use("/api/blogs", require("./routes/blog.routes"));

/* ===============================
   Health Check (Optional)
================================ */
app.get("/health", (req, res) => {
    res.json({ status: "OK", time: new Date() });
});

module.exports = app;
