export const publicTeacherAttributes = {
  exclude: ["password", "cnic"],
};

export const approvedTeacherWhere = (extra = {}) => ({
  ...extra,
  status: "approved",
});

export const sanitizeTeacher = (teacher) => {
  if (!teacher) return null;
  const plain = typeof teacher.toJSON === "function" ? teacher.toJSON() : teacher;
  const { password, cnic, ...safeTeacher } = plain;
  return safeTeacher;
};
