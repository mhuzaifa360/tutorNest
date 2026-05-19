import Teacher from './teacherModel.js';
import { Course } from './courseModel.js';
import Student from './studentModel.js';
import { Enrollment } from './enrollmentModel.js';
import { Job } from './jobsModel.js';
import { Application } from './applicationsModel.js';
import { Review } from './reviewsModel.js';

// =========================
// TEACHER <-> COURSE
// =========================
Teacher.hasMany(Course, {
  foreignKey: "teacherId",
  as: "courses",
});

Course.belongsTo(Teacher, {
  foreignKey: "teacherId",
  as: "teacher",
});

// =========================
// STUDENT <-> COURSE (Many-to-Many via Enrollment)
// =========================
Student.belongsToMany(Course, {
  through: Enrollment,
  foreignKey: "studentId",
  otherKey: "courseId",
  as: "enrolledCourses",
});

Course.belongsToMany(Student, {
  through: Enrollment,
  foreignKey: "courseId",
  otherKey: "studentId",
  as: "students",
});

// =========================
// STUDENT <-> JOB (One-to-Many)
// =========================
Student.hasMany(Job, {
  foreignKey: "studentId",
  as: "jobs",
});

Job.belongsTo(Student, {
  foreignKey: "studentId",
  as: "student",
});

// =========================
// JOB <-> APPLICATION (One-to-Many)
// =========================
Job.hasMany(Application, {
  foreignKey: "jobId",
  as: "applications",
});

Application.belongsTo(Job, {
  foreignKey: "jobId",
  as: "job",
});

// =========================
// TEACHER <-> APPLICATION (One-to-Many via tutorId)
// =========================
Teacher.hasMany(Application, {
  foreignKey: "tutorId",
  as: "applications",
});

Application.belongsTo(Teacher, {
  foreignKey: "tutorId",
  as: "tutor",
});

// =========================
// STUDENT <-> REVIEW (One-to-Many)
// =========================
Student.hasMany(Review, {
  foreignKey: "studentId",
  as: "reviews",
});

Review.belongsTo(Student, {
  foreignKey: "studentId",
  as: "student",
});

// =========================
// TEACHER <-> REVIEW (One-to-Many)
// =========================
Teacher.hasMany(Review, {
  foreignKey: "teacherId",
  as: "reviews",
});

Review.belongsTo(Teacher, {
  foreignKey: "teacherId",
  as: "teacher",
});

export { Teacher, Course, Student, Enrollment, Job, Application, Review };