# Eventa - Wedding Planning & Guest Management

A complete web application to simplify your wedding planning phase with robust event creation and dedicated guest lifecycle management. The application sports a premium Glassmorphism-inspired dark-mode user interface.

## Key Features
- **User Authentication**: Secure JWT-based Login and Registration.
- **Event Dashboard**: Create, view, and manage your custom wedding events.
- **Guest Management**: Dedicated section within any event to add guests along with categorized relationships.
- **RSVP Handling**: Dynamic, real-time RSVP summary counters and immediate dropdown status modifications.
- **Premium UI/UX**: Custom-designed, ultra-modern Glassmorphism interface with custom CSS animations, async loading indicators, and informative toast alerts.

## Project Structure
```text
wedding-planning-and-guest-mgmt/
├── backend/                  # Express/Node JS backend
│   ├── config/db.js          # MongoDB Connect logic
│   ├── controllers/          # API Handlers (Auth, Events, Guests)
│   ├── middleware/           # Express middlewares (JWT Auth)
│   ├── models/               # MongoDB Mongoose Schemas
│   ├── routes/               # API Routes mapping
│   ├── server.js             # Entry Point for the backend
│   ├── package.json          # Backend Dependencies
│   └── .env                  # Environment Variables
└── frontend/                 # Pure Vanilla Frontend (HTML/CSS/JS)
    ├── index.html            # Public Authentication View
    ├── dashboard.html        # Secure Dashboard View
    ├── styles.css            # Global Stylesheet (rich aesthetics)
    └── script.js             # API Integration & App Interface Logic
```

## Steps to Run the Project

### 1. Requirements
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Running locally or configure Mongo Atlas)

### 2. Setup the Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Update `.env` variables if necessary (default defaults to local mongodb `mongodb://127.0.0.1:27017/wedding_planner`).
4. Start the server:
   ```bash
   npm start
   ```
The backend server will run on `http://localhost:5000`.

### 3. Start the Frontend
Since the application connects via REST API (`fetch()`), you just need to serve the frontend directory cleanly.

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. You can use any lightweight HTTP server, we recommend `http-server`:
   ```bash
   npx http-server -p 8080 -c-1
   ```
3. Visit `http://localhost:8080` in your web browser.

---
*Built with ❤️ utilizing Node, Express, MongoDB and pure Vanilla Javascript CSS.*