// frontend/js/api.js

const API_URL = "http://localhost:3000";

// Get all students
async function getStudents() {
    const res = await fetch(`${API_URL}/students`);
    return await res.json();
}

// Get one student
async function getStudent(id) {
    const res = await fetch(`${API_URL}/students/${id}`);
    return await res.json();
}

// Add student
async function addStudent(formData) {
    const res = await fetch(`${API_URL}/students`, {
        method: "POST",
        body: formData
    });

    return await res.json();
}

// Update student
async function updateStudent(id, formData) {
    const res = await fetch(`${API_URL}/students/${id}`, {
        method: "PUT",
        body: formData
    });

    return await res.json();
}

// Delete student
async function deleteStudent(id) {
    const res = await fetch(`${API_URL}/students/${id}`, {
        method: "DELETE"
    });

    return await res.json();
}

// Dashboard summary
async function getDashboardSummary() {
    const res = await fetch(`${API_URL}/dashboard`);
    return await res.json();
}

// Search students
async function searchStudents(query) {
    const res = await fetch(`${API_URL}/students/search?${query}`);
    return await res.json();
}