const API_URL = '/api';

// Utility: Show Toast Message
function showToast(message, isError = false) {
    const toast = document.getElementById('toast-message') || document.getElementById('auth-message');
    if (!toast) return;
    
    toast.textContent = message;
    toast.style.background = isError ? 'var(--danger-color)' : 'var(--success-color)';
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

function toggleSpinner(button, show) {
    if (!button) return;
    const text = button.querySelector('.btn-text');
    const spinner = button.querySelector('.spinner');
    if (text && spinner) {
        if (show) {
            text.classList.add('hidden');
            spinner.classList.remove('hidden');
            button.disabled = true;
        } else {
            text.classList.remove('hidden');
            spinner.classList.add('hidden');
            button.disabled = false;
        }
    }
}

// ------ Authentication Logic (index.html) ------
function toggleAuth(type) {
    const loginSec = document.getElementById('login-section');
    const registerSec = document.getElementById('register-section');
    if(type === 'register') {
        loginSec.classList.add('hidden');
        registerSec.classList.remove('hidden');
    } else {
        registerSec.classList.add('hidden');
        loginSec.classList.remove('hidden');
    }
}

// Ensure user is redirected if already logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    const isDashboard = window.location.pathname.includes('dashboard.html');
    
    if (token && !isDashboard) {
        window.location.href = 'dashboard.html';
    } else if (!token && isDashboard) {
        window.location.href = 'index.html';
    } else if (token && isDashboard) {
        const userName = localStorage.getItem('userName');
        document.getElementById('user-name-display').textContent = `Welcome, ${userName}!`;
        loadEvents();
    }
}

// Login Submit
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const btn = e.target.querySelector('button[type="submit"]');

        toggleSpinner(btn, true);
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', data.name);
                window.location.href = 'dashboard.html';
            } else {
                showToast(data.message || 'Login failed', true);
            }
        } catch (err) {
            showToast('Server error. Is the backend running?', true);
        } finally {
            toggleSpinner(btn, false);
        }
    });
}

// Register Submit
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const btn = e.target.querySelector('button[type="submit"]');

        toggleSpinner(btn, true);
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', data.name);
                window.location.href = 'dashboard.html';
            } else {
                showToast(data.message || 'Registration failed', true);
            }
        } catch (err) {
            showToast('Server error. Is the backend running?', true);
        } finally {
            toggleSpinner(btn, false);
        }
    });
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
}

// ------ Dashboard Logic (dashboard.html) ------
function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
}

function toggleForm(formId) {
    const form = document.getElementById(formId);
    if(form) form.classList.toggle('hidden');
}

// Events Management
async function loadEvents() {
    try {
        const res = await fetch(`${API_URL}/events`, {
            headers: getHeaders()
        });
        const events = await res.json();
        
        if (res.ok) {
            renderEvents(events);
        }
    } catch (err) {
        showToast('Failed to load events', true);
    }
}

function renderEvents(events) {
    const list = document.getElementById('events-list');
    if (!list) return;

    list.innerHTML = '';
    
    if (events.length === 0) {
        list.innerHTML = '<p class="text-muted">No events created yet. Create one!</p>';
        return;
    }

    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.onclick = () => openGuestManager(event);
        
        let dateStr = event.date;
        try {
            dateStr = new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        } catch(e) {}
        
        card.innerHTML = `
            <h3>${event.title}</h3>
            <p><strong>Date:</strong> ${dateStr}</p>
            <p><strong>Venue:</strong> ${event.venue}</p>
            <div class="event-actions">
                <button class="delete-btn" onclick="deleteEvent('${event._id}', event)">Delete</button>
            </div>
        `;
        list.appendChild(card);
    });
}

const createEventForm = document.getElementById('create-event-form');
if (createEventForm) {
    createEventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('event-title').value;
        const date = document.getElementById('event-date').value;
        const venue = document.getElementById('event-venue').value;
        const btn = e.target.querySelector('button[type="submit"]');

        toggleSpinner(btn, true);
        try {
            const res = await fetch(`${API_URL}/events`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ title, date, venue })
            });

            if (res.ok) {
                showToast('Event created successfully');
                createEventForm.reset();
                toggleForm('event-form-container');
                loadEvents();
            } else {
                showToast('Failed to create event', true);
            }
        } catch (err) {
            showToast('Server error', true);
        } finally {
            toggleSpinner(btn, false);
        }
    });
}

async function deleteEvent(id, e) {
    e.stopPropagation(); // prevent opening guest manager

    try {
        const res = await fetch(`${API_URL}/events/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        
        if (res.ok) {
            showToast('Event deleted');
            loadEvents();
            // If they delete the currently viewed event, hide guest section
            if (currentEventId === id) {
                closeGuestManager();
            }
        } else {
            showToast('Failed to delete event', true);
        }
    } catch (err) {
        showToast('Server error', true);
    }
}

// ------ Guest Management Logic ------
let currentEventId = null;

function openGuestManager(event) {
    currentEventId = event._id;
    document.getElementById('current-event-name').textContent = event.title;
    document.getElementById('guest-section').classList.remove('hidden');
    loadGuests();
    
    // Scroll smoothly to guests section
    document.getElementById('guest-section').scrollIntoView({ behavior: 'smooth' });
}

function closeGuestManager() {
    currentEventId = null;
    document.getElementById('guest-section').classList.add('hidden');
}

async function loadGuests() {
    if (!currentEventId) return;
    
    try {
        // Fallback or attempt to fetch guests from backend (to be implemented in backend phase)
        const res = await fetch(`${API_URL}/events/${currentEventId}/guests`, {
            headers: getHeaders()
        });
        
        if (res.ok) {
            const guests = await res.json();
            renderGuests(guests);
        } else if (res.status === 404) {
            // Mock empty list if endpoint doesn't exist yet
            showToast('Backend endpoints for guests not found (404). Backend needs Guest implementation.', true);
            renderGuests([]);
        }
    } catch (err) {
        showToast('Failed to load guests', true);
    }
}

function renderGuests(guests) {
    const tbody = document.getElementById('guests-list');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Summary computation
    let attending = 0;
    let declined = 0;
    let pending = 0;
    
    if (!guests || guests.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted)">No guests added yet. Add one above!</td></tr>`;
        updateRSVPSummary(0, 0, 0, 0);
        return;
    }

    guests.forEach(guest => {
        if (guest.rsvpStatus === 'Attending') attending++;
        else if (guest.rsvpStatus === 'Declined') declined++;
        else pending++;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${guest.name}</td>
            <td>${guest.phone}</td>
            <td>${guest.category}</td>
            <td>
                <select class="rsvp-select" onchange="updateGuestRSVP('${guest._id}', this.value)">
                    <option value="Pending" ${guest.rsvpStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Attending" ${guest.rsvpStatus === 'Attending' ? 'selected' : ''}>Attending</option>
                    <option value="Declined" ${guest.rsvpStatus === 'Declined' ? 'selected' : ''}>Declined</option>
                </select>
            </td>
            <td>
                <button class="delete-btn" onclick="deleteGuest('${guest._id}')">Remove</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    updateRSVPSummary(guests.length, attending, declined, pending);
}

function updateRSVPSummary(total, attending, declined, pending) {
    const elTotal = document.getElementById('total-guests-count');
    const elAttending = document.getElementById('attending-count');
    const elDeclined = document.getElementById('declined-count');
    const elPending = document.getElementById('pending-count');

    if (elTotal) elTotal.textContent = total;
    if (elAttending) elAttending.textContent = attending;
    if (elDeclined) elDeclined.textContent = declined;
    if (elPending) elPending.textContent = pending;
}

const addGuestForm = document.getElementById('add-guest-form');
if (addGuestForm) {
    addGuestForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if(!currentEventId) return;

        const name = document.getElementById('guest-name').value;
        const phone = document.getElementById('guest-phone').value;
        const category = document.getElementById('guest-category').value;
        const btn = e.target.querySelector('button[type="submit"]');

        toggleSpinner(btn, true);
        try {
            const res = await fetch(`${API_URL}/events/${currentEventId}/guests`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ name, phone, category, rsvpStatus: 'Pending' })
            });

            if (res.ok) {
                showToast('Guest added');
                addGuestForm.reset();
                loadGuests();
            } else {
                showToast('Failed to add guest', true);
            }
        } catch (err) {
            showToast('Server error', true);
        } finally {
            toggleSpinner(btn, false);
        }
    });
}

async function updateGuestRSVP(guestId, rsvpStatus) {
    try {
        const res = await fetch(`${API_URL}/guests/${guestId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ rsvpStatus })
        });
        
        if (res.ok) {
            showToast('RSVP updated');
        } else {
            showToast('Failed to update RSVP', true);
        }
    } catch (err) {
        showToast('Server error', true);
    }
}

async function deleteGuest(guestId) {
    try {
        const res = await fetch(`${API_URL}/guests/${guestId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        
        if (res.ok) {
            showToast('Guest removed');
            loadGuests();
        } else {
            showToast('Failed to remove guest', true);
        }
    } catch (err) {
        showToast('Server error', true);
    }
}

// Initial Run
window.addEventListener('DOMContentLoaded', checkAuth);
