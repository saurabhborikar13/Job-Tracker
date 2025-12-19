const BASE_URL = 'https://job-tracker-6nbc.onrender.com/api/v1/auth';
const form = document.getElementById('login-form'); // We reused the ID
const errorMsg = document.getElementById('error-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.name);
            window.location.href = 'index.html';
        } else {
            errorMsg.textContent = data.msg || 'Registration failed';
        }
    } catch (error) {
        errorMsg.textContent = 'Error connecting to server';
    }
});