// Replace this with your actual Render URL (ensure no trailing slash)
const API_URL = 'https://job-tracker-6nbc.onrender.com/api/v1/jobs';

// Select DOM elements
const jobList = document.getElementById('job-list');
const addBtn = document.getElementById('add-btn');
const formContainer = document.getElementById('job-form-container');
const jobForm = document.getElementById('job-form');
const cancelBtn = document.getElementById('cancel-btn');

// 1. Fetch and Display Jobs on Load
async function fetchJobs() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        
        // Clear the "Loading..." text
        jobList.innerHTML = '';

        // Loop through jobs and create cards
        data.jobs.forEach(job => {
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
    } catch (error) {
        jobList.innerHTML = '<p style="color:red">Error loading jobs. Is the backend running?</p>';
        console.error(error);
    }
}

// 2. Handle Form Submission (Create Job)
jobForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page refresh

    const company = document.getElementById('company').value;
    const position = document.getElementById('position').value;
    const status = document.getElementById('status').value;

    const newJob = { company, position, status };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newJob)
        });

        if (res.ok) {
            fetchJobs(); // Refresh the list
            jobForm.reset(); // Clear the form
            formContainer.classList.add('hidden'); // Hide the form
        }
    } catch (error) {
        console.error('Error adding job:', error);
    }
});

// 3. Delete Job Function
async function deleteJob(id) {
    if(!confirm('Are you sure you want to delete this?')) return;

    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchJobs(); // Refresh list
    } catch (error) {
        console.error('Error deleting job:', error);
    }
}

// Toggle Form Visibility
addBtn.addEventListener('click', () => formContainer.classList.remove('hidden'));
cancelBtn.addEventListener('click', () => formContainer.classList.add('hidden'));

// Initial Call
fetchJobs();