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

export const ensureRuntimeSchema = async (sequelize) => {
  const queryInterface = sequelize.getQueryInterface();

  const teachers = await queryInterface.describeTable("teacher");
  await addColumnIfMissing(queryInterface, "teacher", teachers, "cnicFront", {
    type: DataTypes.STRING,
    allowNull: true,
  });
  await addColumnIfMissing(queryInterface, "teacher", teachers, "cnicBack", {
    type: DataTypes.STRING,
    allowNull: true,
  });
  await addColumnIfMissing(queryInterface, "teacher", teachers, "degreeCertificate", {
    type: DataTypes.STRING,
    allowNull: true,
  });
  await addColumnIfMissing(queryInterface, "teacher", teachers, "experienceCertificate", {
    type: DataTypes.STRING,
    allowNull: true,
  });
  await addColumnIfMissing(queryInterface, "teacher", teachers, "rejectionReason", {
    type: DataTypes.TEXT,
    allowNull: true,
  });

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
  await ensureIndex(queryInterface, "notifications", "notifications_user_read_idx", ["userId", "isRead"]);
};
