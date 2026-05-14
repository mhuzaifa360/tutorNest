import { Student } from "./student.js";
import { Teacher } from "./teacher.js";
import { Course } from "./course.js";
import { Enrollment } from "./enrollment.js";

// =========================
// EXISTING RELATIONS
// =========================
Teacher.hasMany(Course, { foreignKey: "teacherId", as: "courses" });
Course.belongsTo(Teacher, { foreignKey: "teacherId", as: "teacher" });

// =========================
// NEW: STUDENT ↔ COURSE (MANY TO MANY)
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