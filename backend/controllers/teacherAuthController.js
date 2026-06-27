import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Teacher } from "../models/index.js";
import { FileRecord } from "../models/index.js";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const parseList = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.map((item) => String(item).trim()).filter(Boolean)
      : [String(parsed).trim()].filter(Boolean);
  } catch {
    return String(value)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

const firstFile = (files, ...keys) => {
  for (const key of keys) {
    if (files?.[key]?.[0]) return files[key][0];
  }
  return null;
};

const uploadPath = (file, folder) =>
  file ? `/uploads/${folder}/${file.filename}` : null;

const handleSignupError = (res, error, fallback) => {
  if (error.name === "SequelizeUniqueConstraintError") {
    const field = error.errors?.[0]?.path || "";
    const message = field === "cnic" ? "CNIC already exists" : "Email already exists";
    return res.status(409).json({ success: false, message, errors: [message] });
  }

  if (error.name === "SequelizeValidationError") {
    const errors = error.errors?.map((item) => item.message) || [error.message];
    return res.status(400).json({ success: false, message: errors[0], errors });
  }

  return res.status(500).json({
    success: false,
    message: fallback,
    errors: [error.message],
  });
};

// =========================
// TEACHER SIGNUP
// =========================
export const signupTeacher = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      mobile,
      province,
      city,
      gender,
      subjects,
      experience,
      bio,
      qualification,
      teachingMode,
      hourlyFee,
      cnic,
    } = req.body;

    const files = req.files || {};
    const profileImageFile = firstFile(files, "profileImage");
    const cnicFrontFile = firstFile(files, "cnicFront");
    const cnicBackFile = firstFile(files, "cnicBack");
    const degreeFile = firstFile(files, "degreeCertificate", "degree");
    const experienceFile = firstFile(files, "experienceCertificate", "certificate");
    const parsedSubjects = parseList(subjects);
    const cleanCnic = String(cnic || "").replace(/-/g, "").trim();
    const parsedExperience = Number(experience);
    const parsedHourlyFee = Number(hourlyFee);

    const errors = [];
    if (!firstName?.trim()) errors.push("First name is required");
    if (!lastName?.trim()) errors.push("Last name is required");
    if (!email?.trim()) errors.push("Email is required");
    if (!password || password.length < 6) errors.push("Password must be at least 6 characters");
    if (!mobile?.trim()) errors.push("Mobile number is required");
    if (!gender) errors.push("Gender is required");
    if (!province?.trim()) errors.push("Province is required");
    if (!city?.trim()) errors.push("City is required");
    if (!qualification?.trim()) errors.push("Missing qualification");
    if (!Number.isFinite(parsedExperience) || parsedExperience < 0) errors.push("Invalid experience");
    if (!["online", "home", "both"].includes(teachingMode)) errors.push("Invalid teaching mode");
    if (!Number.isFinite(parsedHourlyFee) || parsedHourlyFee <= 0) errors.push("Invalid hourly fee");
    if (!/^\d{13}$/.test(cleanCnic)) errors.push("Invalid CNIC");
    if (!parsedSubjects.length) errors.push("Invalid subjects");
    if (!profileImageFile) errors.push("Profile image required");
    if (!cnicFrontFile) errors.push("CNIC front is required");
    if (!cnicBackFile) errors.push("CNIC back is required");
    if (!degreeFile) errors.push("Degree certificate is required");
    if (!experienceFile) errors.push("Experience certificate is required");

    if (errors.length) {
      return res.status(400).json({
        success: false,
        message: errors[0],
        errors,
      });
    }

    const profileImage = uploadPath(profileImageFile, "profile");
    const cnicFront = uploadPath(cnicFrontFile, "documents");
    const cnicBack = uploadPath(cnicBackFile, "documents");
    const degreeCertificate = uploadPath(degreeFile, "documents");
    const experienceCertificate = uploadPath(experienceFile, "documents");
    const normalizedEmail = normalizeEmail(email);

    const existingTeacher = await Teacher.findOne({
      where: { email: normalizedEmail },
    });

    if (existingTeacher) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
        errors: ["Email already exists"],
      });
    }

    // Check CNIC uniqueness
    const existingCnic = await Teacher.findOne({
      where: { cnic: cleanCnic },
    });

    if (existingCnic) {
      return res.status(409).json({
        success: false,
        message: "CNIC already exists",
        errors: ["CNIC already exists"],
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = await Teacher.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      mobile: mobile.trim(),
      province: province.trim(),
      city: city.trim(),
      gender,
      subjects: parsedSubjects,
      experience: parsedExperience,
      bio: bio || null,
      profileImage,
      cnicFront,
      cnicBack,
      degreeCertificate,
      experienceCertificate,
      qualification: qualification.trim(),
      teachingMode,
      hourlyFee: parsedHourlyFee,
      cnic: cleanCnic,
      status: "pending",
      rejectionReason: null,
    });

    const token = jwt.sign(
      {
        id: newTeacher.id,
        role: "teacher",
        firstName: newTeacher.firstName,
        lastName: newTeacher.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // If files were uploaded (documents), persist FileRecord entries
    try {
      const files = req.files || {};
      const entries = [];
      [
        { key: "profileImage", file: profileImageFile, type: "profile", url: profileImage },
        { key: "cnicFront", file: cnicFrontFile, type: "verification", url: cnicFront },
        { key: "cnicBack", file: cnicBackFile, type: "verification", url: cnicBack },
        { key: "degreeCertificate", file: degreeFile, type: "verification", url: degreeCertificate },
        { key: "experienceCertificate", file: experienceFile, type: "verification", url: experienceCertificate },
      ].forEach(({ file: f, type, url }) => {
        if (f) {
          entries.push({
            ownerId: newTeacher.id,
            ownerRole: "teacher",
            type,
            entityId: null,
            url,
            filename: f.filename,
            originalName: f.originalname,
            mimeType: f.mimetype,
            size: f.size,
          });
        }
      });

      if (entries.length) {
        await FileRecord.bulkCreate(entries);
      }
    } catch (err) {
      console.warn("Failed to save teacher document records:", err.message);
    }

    const safeUser = newTeacher.toJSON();
    const responseUser = {
      id: safeUser.id,
      firstName: safeUser.firstName,
      lastName: safeUser.lastName,
      email: (safeUser.email || "").toString().trim().toLowerCase(),
      role: "teacher",
      profileImage: safeUser.profileImage || null,
      status: safeUser.status,
      rejectionReason: safeUser.rejectionReason || null,
    };

    return res.status(201).json({
      success: true,
      token,
      user: responseUser,
    });
  } catch (error) {
    console.error("Teacher Signup Error:", error.message);
    return handleSignupError(res, error, "Teacher signup failed");
  }
};

// =========================
// TEACHER LOGIN
// =========================
export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const teacher = await Teacher.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: teacher.id,
        role: "teacher",
        firstName: teacher.firstName,
        lastName: teacher.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    const safeUser = teacher.toJSON();
    const responseUser = {
      id: safeUser.id,
      firstName: safeUser.firstName,
      lastName: safeUser.lastName,
      email: (safeUser.email || "").toString().trim().toLowerCase(),
      role: "teacher",
      profileImage: safeUser.profileImage || null,
      status: safeUser.status,
      rejectionReason: safeUser.rejectionReason || null,
    };

    return res.status(200).json({
      success: true,
      token,
      user: responseUser,
    });
  } catch (error) {
    console.error("Teacher Login Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Teacher login failed",
      error: error.message,
    });
  }
};
