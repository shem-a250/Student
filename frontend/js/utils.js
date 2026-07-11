// frontend/js/utils.js

function showLoader() {
    document.getElementById("globalLoader").style.display = "flex";
}

function hideLoader() {
    document.getElementById("globalLoader").style.display = "none";
}

function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

function showMessage(message) {
    alert(message);
}