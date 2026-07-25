const mongoose = require("mongoose");

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ MongoDB Atlas Connected Successfully");
    } catch (err) {
        console.error("❌ Database Connection Failed:", err.message);
        process.exit(1);
    }
}

// Student Schema
const studentSchema = new mongoose.Schema(
    {
        studentId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true
        },

        gender: {
            type: String,
            enum: ["Male", "Female"],
            required: true
        },

        dob: {
            type: Date,
            required: true
        },

        department: {
            type: String,
            required: true,
            trim: true
        },

        academicYear: {
            type: String,
            required: true
        },

        photo: {
            type: String,
            default: "/images/avatar.png"
        }
    },
    {
        timestamps: true
    }
);

// Student Model
const Student = mongoose.model("Student", studentSchema);

// Export
module.exports = {
    connectDB,
    Student
};