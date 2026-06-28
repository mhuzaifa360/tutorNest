# TutorNest

TutorNest is a role-based tutor finder and learning marketplace built with React, Tailwind CSS, Node.js, Express, MySQL, Sequelize, Socket.io, and JWT authentication.

## Features

- Student, teacher, and admin authentication with JWT.
- Admin approval workflow for teachers. Pending and rejected teachers are hidden from public listings, Tutor Finder, search, saved teachers, recommendations, courses, applications, and home-page tutor sections.
- Admin registration notifications for new teachers and students, with profile image, name, role, registration time, and admin quick actions for teacher approve/reject/view.
- Private teacher verification documents. Profile images are public; teacher CNIC, degree, certificate, resume, and verification files are available only to admins.
- Tutor Finder, public teacher listings, home featured tutors, saved teachers, and teacher profile pages show approved teachers only.
- Teacher profile actions for students: Save, Message, and Hire Me.
- Saved Teachers dashboard with save/remove, profile, and message actions.
- Review system with rating, comment, student name, student profile picture, teacher, and date. Latest reviews appear first on the home page.
- Course enrollment with duplicate prevention and notifications.
- Dashboard navigation in the top navbar for student, teacher, and admin layouts on desktop and mobile.
- Notifications with unread badges, mark-read actions, delete actions, polling fallback, and Socket.io push for newly created notifications.
- Messaging between students, teachers, and admins, with Socket.io direct-message delivery, typing hooks, presence snapshots, and unread counts.
- Voice/video call signaling hooks over Socket.io: incoming call, accept, reject, end, and WebRTC signal relay.
- Meeting scheduling API between students and teachers, including accept, reject, and reschedule notifications.
- Admin management screens for users, students, teachers, courses, jobs, applications, reviews, reports, and settings.

## User Roles

- Student: find approved tutors, save teachers, message teachers, hire teachers, enroll in courses, post jobs, review teachers, and schedule meetings.
- Teacher: manage profile and courses, apply to jobs after approval, message students, receive hire requests, respond to meeting requests, and view students.
- Admin: approve/reject teachers, manage users/content, view private verification documents, moderate reviews/applications, and receive registration notifications.

## Admin Verification Workflow

Teacher verification is enforced on the backend, not only in the frontend UI.

1. A newly registered teacher is saved with `status: "pending"`.
2. Pending and rejected teachers are excluded from public/student teacher reads, including Tutor Finder, Teachers Page search results, ranked/home tutors, saved teachers, public profile, courses, enrollments, applications, jobs, chat conversation participants, and student dashboard snippets.
3. Admins can still see pending, approved, and rejected teachers in admin management.
4. Admin approval uses `PUT /v1/admin/teachers/:id/status` with `{ "status": "approved" }`.
5. Admin rejection uses the same endpoint with `{ "status": "rejected" }`.
6. Only `approved` teachers become visible across the student/public app.

Students do not currently have a verification status field in the TutorNest schema, so student verification is not enabled. If student verification is added later, the same pattern should be applied with a student status column and approved-only filters on student-facing reads.

## Teacher Profile Actions

When a logged-in student opens an approved teacher profile from Tutor Finder, search results, home featured tutors, or Saved Teachers, the profile header shows:

- Save: saves the teacher, removes the teacher when already saved, and shows a filled bookmark icon while saved.
- Message: opens the student messages page directly to that teacher conversation. If no conversation exists yet, the app creates it by sending the first message once.
- Hire Me: stores a pending hire request and creates a teacher notification.

## Teacher Documents And Reviews

- Teacher verification documents such as CNIC, degree files, certificates, resumes, and verification uploads are hidden from students and teachers.
- Only admins can list, view, or download teacher verification documents from Teacher Management.
- Students can submit teacher reviews with a 1-5 rating and comment.
- Review responses and review lists include the student name, student profile picture, rating, comment, teacher, and review date.
- The Home page loads the latest reviews dynamically from `/v1/reviews/getReviews?limit=6`, ordered newest first.

## Key APIs

### Authentication

```http
POST /v1/auth/student/signup
POST /v1/auth/student/login
POST /v1/auth/teacher/signup
POST /v1/auth/teacher/login
POST /v1/auth/login
```

### Teacher Approval And Discovery

```http
GET    /v1/teachers
GET    /v1/teachers/:id
GET    /v1/teachers/ranked
GET    /v1/search/teachers
GET    /v1/recommend
PUT    /v1/admin/teachers/:id/status
```

### Profiles And Documents

```http
GET    /v1/profile/me
PUT    /v1/profile/update
PUT    /v1/profile/change-password
DELETE /v1/profile/delete-account

GET    /v1/upload/files
GET    /v1/upload/files/:id/download
POST   /v1/upload/profile-image
POST   /v1/upload/document
DELETE /v1/upload/delete/:id
```

### Saved Teachers, Hire Requests, Reviews

```http
GET    /v1/student/saved-teachers
POST   /v1/student/saved-teachers
DELETE /v1/student/saved-teachers/:teacherId

POST   /v1/hire-requests

GET    /v1/reviews/getReviews
POST   /v1/reviews/createReview
PUT    /v1/reviews/updateReview/:id
DELETE /v1/reviews/deleteReview/:id
```

### Chat, Calls, Meetings

```http
POST /v1/messages/send
GET  /v1/messages/conversations/:userId
GET  /v1/messages/:conversationId

GET   /v1/meetings
POST  /v1/meetings
PATCH /v1/meetings/:id
```

Socket.io events include `direct_message`, `notification_created`, `presence_snapshot`, `user_online`, `user_offline`, `typing_direct`, `stop_typing_direct`, `incoming_call`, `call_accept`, `call_reject`, `call_end`, and `webrtc_signal`.

### Notifications

```http
GET    /v1/notifications
GET    /v1/notifications/unread-count
PATCH  /v1/notifications/read
PUT    /v1/notifications/markAsRead/:id
PUT    /v1/notifications/markAllAsRead
DELETE /v1/notifications/deleteNotification/:id
```

## Installation

1. Install backend dependencies.

```bash
cd backend
npm install
```

2. Create `backend/.env`.

```env
PORT=5000
CORS_ORIGIN=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tutornest
DB_USER=root
DB_PASSWORD=
DB_DIALECT=mysql
DB_SYNC=false
DB_LOGGING=false
JWT_SECRET=change_me
JWT_EXPIRES_IN=7d
UPLOAD_DIR=uploads
```

3. Start the backend.

```bash
npm run dev
```

4. Install and start the frontend.

```bash
cd frontend
npm install
npm run dev
```

## Folder Structure

```txt
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  socket/
  uploads/
  utils/

frontend/src/
  components/
  context/
  layouts/
  pages/
    admin/
    student/
    teacher/
  routes/
  services/
  utils/
```

## Production Notes

- Use a strong `JWT_SECRET` and restrict `CORS_ORIGIN` to the deployed frontend.
- Store private documents outside a public static directory in production, or move uploads to private object storage.
- Keep `DB_SYNC=false` outside local setup. Runtime schema guards add required compatibility columns/tables.
- Add TURN/STUN credentials before enabling full browser-to-browser calling in production networks.
- Add pagination for large teacher, course, review, notification, and message datasets.

## Future Improvements

- Full in-browser WebRTC call room UI with camera/mic/screen controls and call duration persistence.
- Meeting reminder workers for scheduled notification delivery before start time.
- Teacher hire request accept/reject dashboard.
- Cloud storage and virus scanning for uploaded documents.
- Code splitting for the frontend bundle.
