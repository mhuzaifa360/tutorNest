# TutorNest – Learning & Teaching Marketplace Platform

## 📖 Overview

TutorNest is a Learning & Teaching Marketplace Platform where students can find teachers, enroll in courses, post tuition jobs, and communicate directly with teachers. Teachers can create profiles, offer courses, apply for jobs, and manage their students. Admins manage the entire platform.

---

# 🚀 Features

## 👤 Guest

- Browse Teachers
- Browse Courses
- Browse Jobs
- View Teacher Profiles
- Register / Login

---

## 🎓 Student

- Register / Login
- Search Teachers
- Save Favorite Teachers
- Enroll in Courses
- Post Tuition Jobs
- Manage Posted Jobs
- View Applications
- Chat with Teachers
- Leave Reviews & Ratings
- Manage Profile

---

## 👨‍🏫 Teacher

- Register / Login
- Create Professional Profile
- Upload Documents & Certificates
- Verification Request
- Create & Manage Courses
- Browse Jobs
- Apply for Jobs
- Manage Students
- Chat with Students
- View Earnings
- Manage Reviews

---

## 👨‍💼 Admin

- Dashboard Analytics
- User Management
- Teacher Verification
- Course Management
- Job Management
- Application Management
- Review Moderation
- Reports & System Settings

---

# 🏗 System Architecture

## Frontend

- React.js
- Tailwind CSS
- React Router
- Axios
- Context API

### Public Pages

- Home
- Teachers
- Teacher Details
- Courses
- Course Details
- Jobs
- Job Details
- About
- Contact
- Login
- Signup

### Student Dashboard

- Dashboard
- My Courses
- Saved Teachers
- Saved Courses
- My Jobs
- Applications
- Messages
- Reviews
- Notifications
- Settings

### Teacher Dashboard

- Dashboard
- Profile
- Verification
- Courses
- Students
- Job Applications
- Earnings
- Messages
- Reviews
- Notifications
- Settings

### Admin Dashboard

- Dashboard
- Users
- Teachers
- Courses
- Jobs
- Applications
- Reviews
- Reports
- Notifications
- Settings

---

# ⚙ Backend

## Authentication Module

Features:

- Register
- Login
- Logout
- JWT Authentication
- Refresh Token
- Forgot Password
- Reset Password
- Email Verification
- Role Authorization

API Endpoints:

```http
POST /v1/auth/student/signup
POST /v1/auth/student/login
POST /v1/auth/teacher/signup
POST /v1/auth/teacher/login
```

---

## Teacher Module

Features:

- Teacher CRUD
- Profile Management
- Verification System
- Education & Experience
- Skills & Subjects
- Availability
- Documents Upload

Endpoints:

```http
GET    /v1/teachers/getTeachers
GET    /v1/teachers/getTeacherRating/:id
POST   /v1/teachers/createTeacher
PUT    /v1/teachers/updateTeacher/:id
DELETE /v1/teachers/deleteTeacher/:id
get /v1/teachers/ranked
```

---

## Course Module

Features:

- Course CRUD
- Categories
- Enrollments
- Progress Tracking
- Reviews

Endpoints:

```http
GET    /v1/courses/getCourses
GET    /v1/courses/getSingleCourse/:id
POST   /v1/courses/createCourse
PUT    /v1/courses/updateCourse/:id
DELETE /v1/courses/deleteCourse/:id
```

---

## Job Module

Features:

- Create Jobs
- Browse Jobs
- Manage Jobs
- Featured Jobs

Endpoints:

```http
GET    /v1/jobs/getJobs
GET    /v1/jobs/getSingleJob/:id
POST   /v1/jobs/createJob
PUT    /v1/jobs/updateJob/:id
DELETE /v1/jobs/deleteJob/:id
```

---

## Application Module

Features:

- Apply for Jobs
- Manage Applications
- Accept / Reject Applications
- Application Status

Endpoints:

```http
GET    /v1/applications/getApplications
GET    /v1/applications/getSingleApplication
POST   /v1/applications/apply
PUT    /v1/applications/updateApplication/:id
DELETE /v1/applications/deleteApplication/:id
```

---

## Review Module

Features:

- Teacher Reviews
- Course Reviews
- Ratings System

Endpoints:

```http
GET    /v1/reviews/getReviews
GET    /v1/reviews/getSingleReview/:id
POST   /v1/reviews/createReview
PUT    /v1/reviews/updateReview/:id
DELETE /v1/reviews/deleteReview/:id
```

---
## Notification Module

Features:

- Email Notifications
- In-App Notifications
- Job Alerts
- Verification Updates

Endpoints:

```http
GET  /v1/notifications/getNotifications
put /v1/notifications/markAsRead/:id
put /v1/notifications/deleteNotification/:id
```

---

## Search & Recommendation Module

### Search Filters

- Teacher
- Jobs
- course

### Smart Ranking

- Featured Teachers
- Highest Rated Teachers
- Most Reviewed Teachers
- Recommended Teachers
- Trending Courses
- Featured Jobs

---

# 🗄 Database Schema

## Core Tables

```sql
New
admins
applications
courses
enrollments
jobs
notifications
reviews
savedjobs
students
teacher

---

# 🔐 Security

- JWT Authentication
- bcrypt Password Hashing
- Role Based Access Control
- Protected Routes
- Refresh Tokens
- Input Validation
- API Security Middleware

---

# 🔌 External Services

Current:

- Email Service

Future:

- Stripe
- JazzCash
- EasyPaisa
- Google OAuth
- Cloudinary
- Socket.io

---

# 💻 Tech Stack

## Frontend

- React.js
- Tailwind CSS
- React Router
- Axios
- Context API

## Backend

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT
- bcrypt

---

# 📂 Frontend Structure

```txt
src/
├── assets/
├── components/
│   ├── common/
│   ├── home/
│   └── layout/
│
├── context/
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│
├── layouts/
│   ├── StudentLayout.jsx
│   ├── TeacherLayout.jsx
│   └── AdminLayout.jsx
│
├── pages/
│   └── admin/
│       └── adminDashboard.jsx
│   └── student/
│       └── studentDashboard.jsx
│   └── teacher/
│       └── teacherDashboard.jsx
│   ├── about.jsx
│   ├── contact.jsx
│   ├── courses.jsx
│   ├── home.jsx
│   ├── login.jsx
│   ├── signup.jsx
│   ├── teachers.jsx
│
├── routes/
├── services/
├── utils/
└── App.jsx
```

---

# 🎯 Current Development Status

### Completed

- Authentication System
- JWT Integration
- Role-Based Architecture
- Teacher CRUD
- Theme System
- Search & Filter Backend

### In Progress

- Protected Routes
- Dashboard Layouts
- Course CRUD
- Job CRUD Frontend
- Application Management

### Planned

- Real-Time Chat (Socket.io)
- Notifications System
- Recommendation Engine
- Payment Integration
- Video Session Integration

---

## 👨‍💻 Developer

**Muhammad Huzaifa**
Portfolio:
https://mhuzaifa-portfolio.vercel.app

Project:
TutorNest – Learning & Teaching Marketplace Platform