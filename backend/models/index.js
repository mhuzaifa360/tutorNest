import Teacher from "./teacherModel.js";
import { Course } from "./courseModel.js";
import Student from "./studentModel.js";
import { Enrollment } from "./enrollmentModel.js";
import { Job } from "./jobsModel.js";
import { Application } from "./applicationsModel.js";
import { Review } from "./reviewsModel.js";
import { SavedJob } from "./savedJobModel.js";
import { SavedTeacher } from "./savedTeacherModel.js";
import { Notification } from "./notificationModel.js";
import { Message } from "./messageModel.js";
import { EmailToken } from "./emailTokenModel.js";
import { FileRecord } from "./fileModel.js";
import { VerificationRequest } from "./verificationRequestModel.js";
import { Transaction } from "./transactionModel.js";
import { Conversation } from "./Conversation.js";
import { ChatMessage } from "./Message.js";

// TEACHER <-> COURSE
Teacher.hasMany(Course, {
  foreignKey: "teacherId",
  as: "courses",
});

Course.belongsTo(Teacher, {
  foreignKey: "teacherId",
  as: "teacher",
});

// STUDENT <-> COURSE
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

// STUDENT <-> JOB
Student.hasMany(Job, {
  foreignKey: "studentId",
  as: "jobs",
});

Job.belongsTo(Student, {
  foreignKey: "studentId",
  as: "student",
});

// JOB <-> APPLICATION
Job.hasMany(Application, {
  foreignKey: "jobId",
  as: "applications",
});

Application.belongsTo(Job, {
  foreignKey: "jobId",
  as: "job",
});

// TEACHER <-> APPLICATION
Teacher.hasMany(Application, {
  foreignKey: "tutorId",
  as: "applications",
});

Application.belongsTo(Teacher, {
  foreignKey: "tutorId",
  as: "tutor",
});

// STUDENT <-> REVIEW
Student.hasMany(Review, {
  foreignKey: "studentId",
  as: "reviews",
});

Review.belongsTo(Student, {
  foreignKey: "studentId",
  as: "student",
});

// TEACHER <-> REVIEW
Teacher.hasMany(Review, {
  foreignKey: "teacherId",
  as: "reviews",
});

Review.belongsTo(Teacher, {
  foreignKey: "teacherId",
  as: "teacher",
});

// STUDENT <-> SAVED JOB
Student.hasMany(SavedJob, {
  foreignKey: "studentId",
  as: "savedJobs",
});

SavedJob.belongsTo(Student, {
  foreignKey: "studentId",
  as: "student",
});

// JOB <-> SAVED JOB
Job.hasMany(SavedJob, {
  foreignKey: "jobId",
  as: "savedByStudents",
});

SavedJob.belongsTo(Job, {
  foreignKey: "jobId",
  as: "job",
});

// STUDENT <-> SAVED TEACHER
Student.hasMany(SavedTeacher, {
  foreignKey: "studentId",
  as: "savedTeachers",
});

SavedTeacher.belongsTo(Student, {
  foreignKey: "studentId",
  as: "student",
});

Teacher.hasMany(SavedTeacher, {
  foreignKey: "teacherId",
  as: "savedByStudents",
});

SavedTeacher.belongsTo(Teacher, {
  foreignKey: "teacherId",
  as: "teacher",
});

// USER NOTIFICATIONS
Student.hasMany(Notification, {
  foreignKey: "userId",
  as: "notifications",
});

Teacher.hasMany(Notification, {
  foreignKey: "userId",
  as: "notifications",
});

Notification.belongsTo(Student, {
  foreignKey: "userId",
  constraints: false,
});

Notification.belongsTo(Teacher, {
  foreignKey: "userId",
  constraints: false,
});

// VERIFICATION REQUESTS
Teacher.hasOne(VerificationRequest, {
  foreignKey: "teacherId",
  as: "verificationRequest",
});
VerificationRequest.belongsTo(Teacher, {
  foreignKey: "teacherId",
  as: "teacher",
});

// FILE RECORDS
Student.hasMany(FileRecord, {
  foreignKey: "ownerId",
  as: "files",
  constraints: false,
});
Teacher.hasMany(FileRecord, {
  foreignKey: "ownerId",
  as: "files",
  constraints: false,
});
FileRecord.belongsTo(Student, {
  foreignKey: "ownerId",
  constraints: false,
});
FileRecord.belongsTo(Teacher, {
  foreignKey: "ownerId",
  constraints: false,
});

// CHAT: Conversations & Messages
Student.hasMany(Conversation, {
  foreignKey: "studentId",
  as: "conversations",
});

Teacher.hasMany(Conversation, {
  foreignKey: "teacherId",
  as: "conversations",
});

Conversation.belongsTo(Student, {
  foreignKey: "studentId",
  as: "student",
});

Conversation.belongsTo(Teacher, {
  foreignKey: "teacherId",
  as: "teacher",
});

Conversation.hasMany(ChatMessage, {
  foreignKey: "conversationId",
  as: "messages",
});

ChatMessage.belongsTo(Conversation, {
  foreignKey: "conversationId",
  as: "conversation",
});

// EXPORT ALL MODELS
export {
  Teacher,
  Course,
  Student,
  Enrollment,
  Job,
  Application,
  Review,
  SavedJob,
  SavedTeacher,
  Notification,
  Message,
  Conversation,
  ChatMessage,
  EmailToken,
  FileRecord,
  VerificationRequest,
  Transaction,
};
