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

  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: {
          200: {
            description: "Server is running",
          },
        },
      },
    },

    "/api/v1/students": {
      get: {
        summary: "Get all students",
        responses: {
          200: {
            description: "Students fetched successfully",
          },
        },
      },
      post: {
        summary: "Create new student",
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
        responses: {
          201: {
            description: "Student created successfully",
          },
        },
      },
    },

    "/api/v1/students/{id}": {
      get: {
        summary: "Get student by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Student details",
          },
          404: {
            description: "Student not found",
          },
        },
      },

      put: {
        summary: "Update student",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              example: {
                name: "Updated Name",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Student updated",
          },
        },
      },

      delete: {
        summary: "Delete student",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Student deleted",
          },
        },
      },
    },

    "/api/v1/courses": {
      get: {
        summary: "Get all courses",
        responses: {
          200: {
            description: "Courses fetched",
          },
        },
      },
      post: {
        summary: "Create new course",
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
        responses: {
          201: {
            description: "Course created",
          },
        },
      },
    },

    "/api/v1/departments": {
      get: {
        summary: "Get all departments",
        responses: {
          200: {
            description: "Departments fetched",
          },
        },
      },
      post: {
        summary: "Create department",
        requestBody: {
          content: {
            "application/json": {
              example: {
                name: "Computer Science",
                building: "Block A",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Department created",
          },
        },
      },
    },

    "/api/v1/professors": {
      get: {
        summary: "Get all professors",
        responses: {
          200: {
            description: "Professors fetched",
          },
        },
      },
      post: {
        summary: "Create professor",
        requestBody: {
          content: {
            "application/json": {
              example: {
                name: "Dr Rajesh",
                department_id: 1,
              },
            },
          },
        },
        responses: {
          201: {
            description: "Professor created",
          },
        },
      },
    },

    "/api/v1/semesters": {
      get: {
        summary: "Get all semesters",
      },
      post: {
        summary: "Create semester",
      },
    },

    "/api/v1/enrollments": {
      get: {
        summary: "Get all enrollments",
      },
      post: {
        summary: "Create enrollment",
      },
    },

    "/api/v1/grades": {
      get: {
        summary: "Get all grades",
      },
      post: {
        summary: "Assign grade",
      },
    },
  },
};

module.exports = swaggerDocument;