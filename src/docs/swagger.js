// src/docs/swagger.js
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Course Management System API",
    version: "1.0.0",
    description: "Complete API documentation for Student Course Management System",
  },

  servers: [
    {
      url: "http://localhost:5000",
      description: "Local server",
    },
  ],

  // ✅ JWT Bearer token support
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },

  paths: {
    "/health": {
      get: {
        summary: "Health check",
        tags: ["Health"],
        responses: {
          200: { description: "Server is running" },
        },
      },
    },

    // ── AUTH ───────────────────────────────────────────────────
    "/api/v1/auth/signup": {
      post: {
        summary: "Register new user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                name: "Test User",
                email: "test@test.com",
                password: "123456",
                role: "student",
              },
            },
          },
        },
        responses: {
          201: { description: "Account successfully bana" },
          409: { description: "Email already exists" },
          400: { description: "Validation error" },
        },
      },
    },

    "/api/v1/auth/login": {
      post: {
        summary: "Login user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                email: "test@test.com",
                password: "123456",
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful — token milega" },
          401: { description: "Invalid email ya password" },
        },
      },
    },

    "/api/v1/auth/me": {
      get: {
        summary: "Get logged-in user profile",
        tags: ["Auth"],
        security: [{ BearerAuth: [] }], // 🔒 lock icon
        responses: {
          200: { description: "Profile fetched" },
          401: { description: "Unauthorized — token missing ya invalid" },
        },
      },
    },

    // ── STUDENTS ───────────────────────────────────────────────
    "/api/v1/students": {
      get: {
        summary: "Get all students",
        tags: ["Students"],
        responses: { 200: { description: "Students fetched successfully" } },
      },
      post: {
        summary: "Create new student",
        tags: ["Students"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                name: "Surydeep Singh",
                image: "https://example.com/image.jpg",
                department_id: 1,
              },
            },
          },
        },
        responses: { 201: { description: "Student created successfully" } },
      },
    },

    "/api/v1/students/{id}": {
      get: {
        summary: "Get student by ID",
        tags: ["Students"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: { description: "Student details" },
          404: { description: "Student not found" },
        },
      },
      put: {
        summary: "Update student",
        tags: ["Students"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          content: {
            "application/json": {
              example: { name: "Updated Name" },
            },
          },
        },
        responses: { 200: { description: "Student updated" } },
      },
      delete: {
        summary: "Delete student",
        tags: ["Students"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Student deleted" } },
      },
    },

    // ── COURSES ────────────────────────────────────────────────
    "/api/v1/courses": {
      get: {
        summary: "Get all courses",
        tags: ["Courses"],
        responses: { 200: { description: "Courses fetched" } },
      },
      post: {
        summary: "Create new course",
        tags: ["Courses"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                name: "Data Structures",
                credits: 4,
                department_id: 1,
                professor_id: 1,
              },
            },
          },
        },
        responses: { 201: { description: "Course created" } },
      },
    },

    // ── DEPARTMENTS ────────────────────────────────────────────
    "/api/v1/departments": {
      get: {
        summary: "Get all departments",
        tags: ["Departments"],
        responses: { 200: { description: "Departments fetched" } },
      },
      post: {
        summary: "Create department",
        tags: ["Departments"],
        requestBody: {
          content: {
            "application/json": {
              example: { name: "Computer Science", building: "Block A" },
            },
          },
        },
        responses: { 201: { description: "Department created" } },
      },
    },

    // ── PROFESSORS ─────────────────────────────────────────────
    "/api/v1/professors": {
      get: {
        summary: "Get all professors",
        tags: ["Professors"],
        responses: { 200: { description: "Professors fetched" } },
      },
      post: {
        summary: "Create professor",
        tags: ["Professors"],
        requestBody: {
          content: {
            "application/json": {
              example: { name: "Dr Rajesh", department_id: 1 },
            },
          },
        },
        responses: { 201: { description: "Professor created" } },
      },
    },

    // ── SEMESTERS ──────────────────────────────────────────────
    "/api/v1/semesters": {
      get: {
        summary: "Get all semesters",
        tags: ["Semesters"],
        responses: { 200: { description: "Semesters fetched" } },
      },
      post: {
        summary: "Create semester",
        tags: ["Semesters"],
        requestBody: {
          content: {
            "application/json": {
              example: { name: "Fall 2024" },
            },
          },
        },
        responses: { 201: { description: "Semester created" } },
      },
    },

    "/api/v1/semesters/{id}/enrollments": {
      get: {
        summary: "Get enrollments by semester",
        tags: ["Semesters"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Enrollments fetched" } },
      },
    },

    // ── ENROLLMENTS ────────────────────────────────────────────
    "/api/v1/enrollments": {
      get: {
        summary: "Get all enrollments",
        tags: ["Enrollments"],
        responses: { 200: { description: "Enrollments fetched" } },
      },
      post: {
        summary: "Create enrollment",
        tags: ["Enrollments"],
        requestBody: {
          content: {
            "application/json": {
              example: {
                student_id: 1,
                course_id: 1,
                semester_id: 1,
              },
            },
          },
        },
        responses: { 201: { description: "Enrollment created" } },
      },
    },

    // ── GRADES ─────────────────────────────────────────────────
    "/api/v1/grades": {
      get: {
        summary: "Get all grades",
        tags: ["Grades"],
        responses: { 200: { description: "Grades fetched" } },
      },
      post: {
        summary: "Assign grade",
        tags: ["Grades"],
        requestBody: {
          content: {
            "application/json": {
              example: {
                enrollment_id: 1,
                grade: "A",
              },
            },
          },
        },
        responses: { 201: { description: "Grade assigned" } },
      },
    },

    "/api/v1/grades/student/{student_id}": {
      get: {
        summary: "Get grades by student",
        tags: ["Grades"],
        parameters: [{ name: "student_id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Student grades fetched" } },
      },
    },

    "/api/v1/grades/course/{course_id}": {
      get: {
        summary: "Get grades by course",
        tags: ["Grades"],
        parameters: [{ name: "course_id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Course grades fetched" } },
      },
    },
  },
};

module.exports = swaggerDocument;