const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
require("dotenv").config();

const { connectDB, Student } = require("./db");

const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, "frontend")));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =======================
// Multer Configuration
// =======================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1E9);

        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    }
});

const upload = multer({
    storage
});

// ==================================
// HOME ROUTE
// ==================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dashboard.html"));
});

// ==================================
// ADD STUDENT
// ==================================

app.post("/students", upload.single("photo"), async (req, res) => {
    try {

        const {
            studentId,
            firstName,
            lastName,
            gender,
            dob,
            department,
            academicYear
        } = req.body;

        const exists = await Student.findOne({ studentId });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Student ID already exists."
            });
        }

        const student = new Student({
            studentId,
            firstName,
            lastName,
            gender,
            dob,
            department,
            academicYear,
            photo: req.file
                ? "/uploads/" + req.file.filename
                : "/images/avatar.png"
        });

        await student.save();

        res.status(201).json({
            success: true,
            message: "Student added successfully.",
            data: student
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});
// ====================================
// GET ALL STUDENTS
// =====================================

app.get("/students", async (req, res) => {
    try {

        const students = await Student.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});
// =====================================
// GET SINGLE STUDENT
// =====================================

app.get("/students/:id", async (req, res) => {
    try {

        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }

        res.json({
            success: true,
            data: student
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});
// =====================================
// UPDATE STUDENT
// =====================================

app.put("/students/:id", upload.single("photo"), async (req, res) => {

    try {

        const {
            studentId,
            firstName,
            lastName,
            gender,
            dob,
            department,
            academicYear
        } = req.body;

        const updateData = {
            studentId,
            firstName,
            lastName,
            gender,
            dob,
            department,
            academicYear
        };

        if (req.file) {
            updateData.photo = "/uploads/" + req.file.filename;
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }

        res.json({
            success: true,
            message: "Student updated successfully.",
            data: student
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});
// =====================================
// DELETE STUDENT
// =====================================

app.delete("/students/:id", async (req, res) => {

    try {

        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }

        res.json({
            success: true,
            message: "Student deleted successfully."
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});
// =====================================
// DASHBOARD SUMMARY
// =====================================

app.get("/dashboard", async (req, res) => {

    try {

        const students = await Student.find();

        const totalStudents = students.length;

        const male = students.filter(s => s.gender === "Male").length;

        const female = students.filter(s => s.gender === "Female").length;

        const departments = [...new Set(students.map(s => s.department))].length;

        const academicYears = [...new Set(students.map(s => s.academicYear))].length;

        res.json({
            success: true,
            data: {
                totalStudents,
                male,
                female,
                departments,
                academicYears
            }
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});
// =====================================
// SEARCH STUDENTS
// =====================================

app.get("/students/search", async (req, res) => {

    try {

        const { id, firstName, lastName, department, gender } = req.query;

        let query = {};

        if (id) {
            query.studentId = new RegExp(id, "i");
        }

        if (firstName) {
            query.firstName = new RegExp(firstName, "i");
        }

        if (lastName) {
            query.lastName = new RegExp(lastName, "i");
        }

        if (department) {
            query.department = department;
        }

        if (gender) {
            query.gender = gender;
        }

        const students = await Student.find(query);

        res.json({
            success: true,
            count: students.length,
            data: students
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

// ==================================
// START SERVER
// ==================================

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});