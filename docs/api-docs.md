# Course Management System — API Documentation

Base URL: `http://localhost:5000/api/v1`

All responses follow this format:
```json
{
  "success": true,
  "message": "...",
  "data": { }
}
```

---

## Health Check

| Method | Endpoint  | Description        |
|--------|-----------|--------------------|
| GET    | `/health` | Server status check |

---

## Departments `/api/v1/departments`

### GET /departments
Fetch all departments.

**Response:**
```json
{
  "success": true,
  "message": "Departments fetched successfully.",
  "data": [
    { "id": 1, "name": "Computer Science", "building": "Block A" }
  ]
}
```

### POST /departments
Create a new department.

**Body:**
```json
{ "name": "Computer Science", "building": "Block A" }
```

### GET /departments/:id
Get a department by ID.

### PUT /departments/:id
Update a department.

**Body (any field optional):**
```json
{ "name": "CS & IT", "building": "Block F" }
```

### DELETE /departments/:id
Delete a department.

### GET /departments/:id/professors
Get all professors in a department.

### GET /departments/:id/students
Get all students in a department.

### GET /departments/:id/courses
Get all courses in a department.

---

## Professors `/api/v1/professors`

### GET /professors
Fetch all professors (with department info).

**Query Params:**
- `?department_id=1` — filter by department

### POST /professors
Create a new professor.

**Body:**
```json
{ "name": "Dr. Rajesh Kumar", "department_id": 1 }
```

### GET /professors/:id
Get professor by ID.

### PUT /professors/:id
Update professor.

### DELETE /professors/:id
Delete professor.

### GET /professors/:id/courses
Get all courses assigned to a professor.

---

## Students `/api/v1/students`

### GET /students
Fetch all students.

**Query Params:**
- `?department_id=1` — filter by department

### POST /students
Create a new student.

**Body:**
```json
{
  "name": "Aarav Singh",
  "image": "https://example.com/avatar.jpg",
  "department_id": 1
}
```

### GET /students/:id
Get student by ID.

### PUT /students/:id
Update student.

### DELETE /students/:id
Delete student.

### GET /students/:id/enrollments
Get all enrollments (with course + semester + grade) for a student.

---

## Courses `/api/v1/courses`

### GET /courses
Fetch all courses (with department + professor info).

**Query Params:**
- `?department_id=1`
- `?professor_id=2`

### POST /courses
Create a new course.

**Body:**
```json
{
  "name": "Data Structures & Algorithms",
  "department_id": 1,
  "credits": 4,
  "professor_id": 1
}
```

### GET /courses/:id
Get course by ID.

### PUT /courses/:id
Update course. All body fields are optional (PATCH-style).

### DELETE /courses/:id
Delete course.

### GET /courses/:id/students
Get all students enrolled in this course (across all semesters), including their grade.

**Response data item:**
```json
{
  "enrollment_id": 1,
  "student_id": 1,
  "student_name": "Aarav Singh",
  "student_image": "...",
  "semester_id": 1,
  "semester_name": "2025 Spring",
  "grade": "A"
}
```

---

## Semesters `/api/v1/semesters`

### GET /semesters
Fetch all semesters.

### POST /semesters
Create a new semester.

**Body:**
```json
{ "name": "2026 Spring" }
```

### GET /semesters/:id
Get semester by ID.

### PUT /semesters/:id
Update semester name.

### DELETE /semesters/:id
Delete semester.

### GET /semesters/:id/enrollments
Get all enrollments in this semester (with student + course info).

**Response data item:**
```json
{
  "enrollment_id": 1,
  "student_id": 1,
  "student_name": "Aarav Singh",
  "course_id": 1,
  "course_name": "Data Structures & Algorithms",
  "semester_name": "2025 Spring"
}
```

---

## Enrollments `/api/v1/enrollments`

### GET /enrollments
Fetch all enrollments.

**Query Params:**
- `?student_id=1`
- `?course_id=1`
- `?semester_id=1`

### POST /enrollments
Enroll a student in a course for a semester.

**Body:**
```json
{
  "student_id": 1,
  "course_id": 1,
  "semester_id": 1
}
```

> A student cannot enroll in the same course twice in the same semester (returns 409).

### GET /enrollments/:id
Get a single enrollment by ID.

### DELETE /enrollments/:id
Cancel/remove an enrollment.

---

## Grades `/api/v1/grades`

### GET /grades
Fetch all grades.

**Query Params:**
- `?enrollment_id=1`

### POST /grades
Assign a grade to an enrollment.

**Body:**
```json
{
  "enrollment_id": 1,
  "grade": "A"
}
```

> One enrollment can only have one grade (returns 409 on duplicate).

### GET /grades/:id
Get grade by ID.

### PUT /grades/:id
Update a grade.

**Body:**
```json
{ "grade": "A+" }
```

### DELETE /grades/:id
Delete a grade.

### GET /grades/enrollment/:enrollment_id
Get grade by enrollment ID directly.

---

## Error Responses

| Status | Meaning |
|--------|---------|
| 400    | Bad Request — missing or invalid fields |
| 401    | Unauthorized — no/invalid JWT token |
| 403    | Forbidden — insufficient role |
| 404    | Not Found — resource doesn't exist |
| 409    | Conflict — duplicate entry |
| 422    | Unprocessable Entity — validation error |
| 500    | Internal Server Error |

**Error body:**
```json
{
  "success": false,
  "message": "Course with id 99 not found.",
  "statusCode": 404
}
```

---

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Create .env file and fill in DB credentials

# 3. Create PostgreSQL database
createdb course_management

# 4. Run schema + seed
npm run db:reset

# 5. Start dev server
npm run dev

# 6. Start production server
npm start
```

---

## Project Structure

```
course-management-system/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   ├── modules/
│   │   ├── department/
│   │   ├── professor/
│   │   ├── student/
│   │   ├── course/
│   │   ├── semester/
│   │   ├── enrollment/
│   │   └── grade/
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── utils/
│   │   ├── apiResponse.js
│   │   └── asyncHandler.js
│   ├── app.js
│   └── server.js
├── database/
│   ├── schema.sql
│   └── seed.sql
├── docs/
│   └── api-docs.md
├── package.json
├── .env
└── README.md
```