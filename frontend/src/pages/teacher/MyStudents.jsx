/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { FiBookOpen, FiCalendar, FiMail, FiPhone, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { courseApi, studentApi } from "../../services/apiService";
import { getImageUrl } from "../../utils/getImageUrl";
import PageContainer from "../../components/layout/PageContainer";
import { Card, EmptyState, ErrorState, LoadingState, PageHeader } from "../../components/student/StudentStates";

const getStudentName = (student) =>
  `${student?.firstName || ""} ${student?.lastName || ""}`.trim() || student?.name || "Student";

const getEnrollmentDate = (student, course) =>
  student?.Enrollment?.createdAt ||
  student?.enrollment?.createdAt ||
  student?.enrolledAt ||
  course?.Enrollment?.createdAt ||
  course?.enrollment?.createdAt ||
  "";

const formatDate = (value) => {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const extractStudentsFromCourse = (course) => {
  const enrollmentStudents = Array.isArray(course.enrollments)
    ? course.enrollments.map((enrollment) => enrollment.student).filter(Boolean)
    : [];
  const students =
    course.students ||
    course.enrolledStudents ||
    enrollmentStudents ||
    [];

  return students.map((student) => ({
    ...student,
    enrolledCourse: course.title,
    enrollmentDate: getEnrollmentDate(student, course),
  }));
};

function MyStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    const [coursesResponse, studentsResponse] = await Promise.all([
      courseApi.getAll(),
      studentApi.getAll(),
    ]);

    if (!coursesResponse.ok) {
      setError(coursesResponse.message || "Unable to load teacher courses.");
      setLoading(false);
      return;
    }

    if (!studentsResponse.ok) {
      setError(studentsResponse.message || "Unable to load enrolled students.");
      setLoading(false);
      return;
    }

    const teacherCourses = (coursesResponse.data || []).filter(
      (course) => Number(course.teacherId || course.teacher?.id) === Number(user?.id)
    );

    const byCoursePayload = teacherCourses.flatMap(extractStudentsFromCourse);
    const allStudents = studentsResponse.data || [];
    const byStudentPayload = allStudents.flatMap((student) => {
      const enrolledCourses = student.enrolledCourses || student.courses || [];
      return enrolledCourses
        .filter((course) => Number(course.teacherId || course.teacher?.id) === Number(user?.id))
        .map((course) => ({
          ...student,
          enrolledCourse: course.title,
          enrollmentDate: getEnrollmentDate(student, course),
        }));
    });

    const merged = [...byCoursePayload, ...byStudentPayload];
    const unique = Array.from(
      new Map(
        merged.map((student) => [
          `${student.id}-${student.enrolledCourse || "course"}`,
          student,
        ])
      ).values()
    );

    setStudents(unique);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [user?.id]);

  const total = useMemo(() => students.length, [students]);

  if (loading) return <LoadingState label="Loading enrolled students..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <PageContainer className="animate-fade-in space-y-5">
      <PageHeader
        title="My Students"
        description={`${total} enrolled ${total === 1 ? "student" : "students"} across your courses.`}
      />

      {students.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {students.map((student) => {
            const imageUrl = getImageUrl(student.profileImage);
            return (
              <Card key={`${student.id}-${student.enrolledCourse}`} className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-lg font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={getStudentName(student)}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FiUser />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-bold text-gray-950 dark:text-white">
                      {getStudentName(student)}
                    </h2>
                    <p className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FiMail /> {student.email || "Email not available"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2">
                  <span className="flex items-center gap-2">
                    <FiPhone /> {student.mobile || "Mobile not available"}
                  </span>
                  <span className="flex items-center gap-2">
                    <FiBookOpen /> {student.enrolledCourse || "Course not available"}
                  </span>
                  <span className="flex items-center gap-2 sm:col-span-2">
                    <FiCalendar /> Enrolled {formatDate(student.enrollmentDate)}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No enrolled students yet"
          description="Students enrolled in your courses will appear here."
        />
      )}
    </PageContainer>
  );
}

export default MyStudents;
