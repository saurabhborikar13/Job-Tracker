// CHANGE THIS: Use 'http://localhost:5000' for local testing, or your Render URL for cloud
const BASE_URL = 'https://job-tracker-6nbc.onrender.com/api/v1/auth';

const loginForm = document.getElementById('login-form');
const errorMsg = document.getElementById('error-message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = ''; // Clear old errors

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            // SUCCESS: Save the Token!
            // localStorage is like a tiny database in your browser
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.name);

            // Redirect to the dashboard
            window.location.href = 'index.html';
        } else {
            // ERROR: Show message (e.g., "Invalid Password")
            errorMsg.textContent = data.msg || 'Login failed';
        }
    } catch (error) {
        console.error(error);
        errorMsg.textContent = 'Server error. Is the backend running?';
    }
});