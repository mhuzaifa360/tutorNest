import SequelizePkg from "sequelize";

const { DataTypes } = SequelizePkg;

const addColumnIfMissing = async (queryInterface, tableName, columns, columnName, definition) => {
  if (columns[columnName]) return;
  await queryInterface.addColumn(tableName, columnName, definition);
};

const ensureIndex = async (queryInterface, tableName, indexName, fields, unique = false) => {
  const indexes = await queryInterface.showIndex(tableName);
  const exists = indexes.some((index) => index.name === indexName);
  if (!exists) {
    await queryInterface.addIndex(tableName, fields, { name: indexName, unique });
  }
};

const tableExists = async (queryInterface, tableName) => {
  const tables = await queryInterface.showAllTables();
  return tables.some((table) => {
    const name = typeof table === "string" ? table : table.tableName || table.name;
    return String(name).toLowerCase() === tableName.toLowerCase();
  });
};

const createHireRequestsTableIfMissing = async (queryInterface) => {
  if (await tableExists(queryInterface, "hirerequests")) return;

  await queryInterface.createTable("hirerequests", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected", "cancelled"),
      defaultValue: "pending",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
};

const createMeetingsTableIfMissing = async (queryInterface) => {
  if (await tableExists(queryInterface, "meetings")) return;

  await queryInterface.createTable("meetings", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    durationMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 60,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected", "rescheduled", "cancelled"),
      defaultValue: "pending",
    },
    rescheduleReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
};

export const ensureRuntimeSchema = async (sequelize) => {
  const queryInterface = sequelize.getQueryInterface();

  await createHireRequestsTableIfMissing(queryInterface);
  await createMeetingsTableIfMissing(queryInterface);

  const jobs = await queryInterface.describeTable("jobs");
  await addColumnIfMissing(queryInterface, "jobs", jobs, "province", {
    type: DataTypes.STRING,
    allowNull: true,
  });
  await addColumnIfMissing(queryInterface, "jobs", jobs, "classLevel", {
    type: DataTypes.STRING,
    allowNull: true,
  });
  await addColumnIfMissing(queryInterface, "jobs", jobs, "preferredGender", {
    type: DataTypes.STRING,
    allowNull: true,
  });
  await addColumnIfMissing(queryInterface, "jobs", jobs, "assignedTeacherId", {
    type: DataTypes.INTEGER,
    allowNull: true,
  });

  await sequelize.query(
    "ALTER TABLE `jobs` MODIFY `mode` ENUM('online','home','both') DEFAULT 'home'"
  );
  await sequelize.query(
    "ALTER TABLE `jobs` MODIFY `status` ENUM('open','in-progress','assigned','closed') DEFAULT 'open'"
  );

  const applications = await queryInterface.describeTable("applications");
  await addColumnIfMissing(queryInterface, "applications", applications, "studentId", {
    type: DataTypes.INTEGER,
    allowNull: true,
  });
  await addColumnIfMissing(queryInterface, "applications", applications, "coverLetter", {
    type: DataTypes.TEXT,
    allowNull: true,
  });
  await addColumnIfMissing(queryInterface, "applications", applications, "expectedFee", {
    type: DataTypes.FLOAT,
    allowNull: true,
  });

  await ensureIndex(queryInterface, "jobs", "jobs_student_id_idx", ["studentId"]);
  await ensureIndex(queryInterface, "jobs", "jobs_assigned_teacher_id_idx", ["assignedTeacherId"]);
  await ensureIndex(queryInterface, "applications", "applications_job_tutor_unique", ["jobId", "tutorId"], true);
  await ensureIndex(queryInterface, "applications", "applications_student_id_idx", ["studentId"]);
  const notifications = await queryInterface.describeTable("notifications");
  await addColumnIfMissing(queryInterface, "notifications", notifications, "userRole", {
    type: DataTypes.ENUM("student", "teacher", "admin"),
    allowNull: true,
  });
  await addColumnIfMissing(queryInterface, "notifications", notifications, "metadata", {
    type: DataTypes.JSON,
    allowNull: true,
  });
  await sequelize.query(
    "ALTER TABLE `notifications` MODIFY `type` ENUM('application','job','review','message','registration','hire','enrollment','meeting','call','system') DEFAULT 'system'"
  );
  await ensureIndex(queryInterface, "notifications", "notifications_user_read_idx", ["userId", "isRead"]);
  await ensureIndex(queryInterface, "notifications", "notifications_user_role_read_idx", ["userId", "userRole", "isRead"]);
  await ensureIndex(queryInterface, "hirerequests", "hirerequests_student_teacher_status_idx", ["studentId", "teacherId", "status"]);
  await ensureIndex(queryInterface, "meetings", "meetings_student_teacher_start_idx", ["studentId", "teacherId", "startAt"]);
  await ensureIndex(queryInterface, "meetings", "meetings_teacher_status_idx", ["teacherId", "status"]);
};
