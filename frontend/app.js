// 1. CHECK AUTHENTICATION (The Bouncer)
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

// If no token, kick them back to login
if (!token) {
    window.location.href = 'login.html';
}

// Display User Name
document.getElementById('welcome-msg').textContent = `Welcome back, ${username || 'User'}`;

// API CONFIG
// CHANGE THIS: Use localhost for testing, Render URL for real deployment
const API_URL = 'https://job-tracker-6nbc.onrender.com/api/v1/jobs';

// DOM Elements
const jobList = document.getElementById('job-list');
const addBtn = document.getElementById('add-btn');
const logoutBtn = document.getElementById('logout-btn');
const formContainer = document.getElementById('job-form-container');
const jobForm = document.getElementById('job-form');
const cancelBtn = document.getElementById('cancel-btn');

// --- HELPER: LOGOUT ---
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
});

// --- 1. FETCH JOBS (READ) ---
async function fetchJobs() {
    try {
        const res = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // <--- SHOW ID CARD
            }
        });

        if (res.status === 401) {
            // Token expired or invalid
            logoutBtn.click();
            return;
        }

        const data = await res.json();
        renderJobs(data.jobs);
    } catch (error) {
        jobList.innerHTML = '<p style="color:red">Error loading jobs.</p>';
        console.error(error);
    }
}

function renderJobs(jobs) {
    jobList.innerHTML = '';
    
    if (jobs.length === 0) {
        jobList.innerHTML = '<p>No jobs found. Add one!</p>';
        return;
    }

    jobs.forEach(job => {
        const card = document.createElement('div');
        card.classList.add('job-card');
        card.innerHTML = `
            <div class="job-title">${job.position}</div>
            <div class="job-company">${job.company}</div>
            <span class="status-badge status-${job.status}">${job.status}</span>
            <br>
            <button class="delete-btn" onclick="deleteJob('${job._id}')">Delete</button>
        `;
        jobList.appendChild(card);
    });
}

// --- 2. CREATE JOB (WRITE) ---
jobForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const company = document.getElementById('company').value;
    const position = document.getElementById('position').value;
    const status = document.getElementById('status').value;

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // <--- SHOW ID CARD
            },
            body: JSON.stringify({ company, position, status })
        });

        if (res.ok) {
            fetchJobs(); // Refresh list
            jobForm.reset();
            formContainer.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error adding job:', error);
    }
});

// --- 3. DELETE JOB ---
// Note: We attach this to the window object so the HTML onclick works
window.deleteJob = async (id) => {
    if(!confirm('Delete this job?')) return;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` // <--- SHOW ID CARD
            }
        });
        fetchJobs();
    } catch (error) {
        console.error('Error deleting job:', error);
    }
};

// UI Toggles
addBtn.addEventListener('click', () => formContainer.classList.remove('hidden'));
cancelBtn.addEventListener('click', () => formContainer.classList.add('hidden'));

// Start
fetchJobs();