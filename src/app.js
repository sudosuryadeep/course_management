const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");

const { notFound, errorHandler } = require("./middlewares/error.middleware");

// ── Route imports ──────────────────────────────────────────────
const departmentRoutes  = require("./modules/department/department.routes");
const professorRoutes   = require("./modules/professor/professor.routes");
const studentRoutes     = require("./modules/student/student.routes");
const courseRoutes      = require("./modules/course/course.routes");
const semesterRoutes    = require("./modules/semester/semester.routes");
const enrollmentRoutes  = require("./modules/enrollment/enrollment.routes");
const gradeRoutes       = require("./modules/grade/grade.routes");
const swaggerDocument = require("./docs/swagger");
const authRoutes = require("./modules/auth/auth.routes");

const app = express();

// ── Global Middlewares ─────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

// ── Health Check ───────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Course Management API is running 🚀",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Get api v1
app.get("/api/v1", (req, res) => {
  res.json({
    message: "API is working",
    endpoints: [
      "/students",
      "/courses",
      "/departments",
      "/professors",
      "/semesters",
      "/enrollments",
      "/grades",
      "/auth"
    ]
  });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// ── API Routes ─────────────────────────────────────────────────
const API = "/api/v1";

app.use(`${API}/departments`,  departmentRoutes);
app.use(`${API}/professors`,   professorRoutes);
app.use(`${API}/students`,     studentRoutes);
app.use(`${API}/courses`,      courseRoutes);
app.use(`${API}/semesters`,    semesterRoutes);
app.use(`${API}/enrollments`,  enrollmentRoutes);
app.use(`${API}/grades`,       gradeRoutes);
app.use(`${API}/auth`,         authRoutes);
// ── Error Handlers (must be last) ─────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;