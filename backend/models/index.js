import { Teacher } from "./teacher.js";
import { Course } from "./course.js";

// =========================
// RELATIONSHIP SETUP
// =========================

// Teacher has many Courses
Teacher.hasMany(Course, {
  foreignKey: "teacherId",
  as: "courses",
});

// Course belongs to Teacher
Course.belongsTo(Teacher, {
  foreignKey: "teacherId",
  as: "teacher",
});

export { Teacher, Course };