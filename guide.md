# PeerLearn (formerly Academe) Project Architecture & Developer Guide

This document explains exactly how the entire PeerLearn project works from front to back. Use this as your reference guide whenever you need to manually modify the code.

---

## 1. High-Level Overview

PeerLearn is a Full Stack web application split into two distinct parts:
1.  **Backend (Express + Node.js):** Provides REST API endpoints and connects to a PostgreSQL database using Prisma ORM.
2.  **Frontend (React + Vite):** A Single Page Application (SPA) that consumes the API to display UI to the user. It is styled with Tailwind CSS (v3).

### Tech Stack & Live Deployments
*   **Database:** Neon Serverless PostgreSQL (AWS Singapore, `ap-southeast-1`)
*   **ORM:** Prisma Client v5.22
*   **Backend:** Node.js, Express.js (Live on Render: `https://peerlearn-ur0t.onrender.com`)
*   **Frontend:** React 18 (Vite), React Router v6, Tailwind CSS v3 (Live on Vercel: `https://full-stack-chi-eight.vercel.app`)
*   **Authentication:** JWT (JSON Web Tokens) stored in `localStorage` + Google OAuth 2.0 One-Tap.
*   **Peer Tutoring:** Google Meet integration.

> 📊 **Interactive Production Architecture Diagram:**  
> [peerlearn-production.html](file:///c:/Users/KAMALMONE/OneDrive/Desktop/FSD-PR/PeerV3/.archify/architecture-peerlearn-production-20261008-233700/peerlearn-production.html)

---

## 2. Folder Positioning & Structure

The project lives under `PeerV3/` (the latest iteration) and is split into two main folders:

### A. The Backend: `PeerV3/academe-backend/`
This folder is purely for the server logic.
```text
academe-backend/
├── prisma/
│   ├── schema.prisma   <-- Your database tables are defined here
│   └── seed.js         <-- Script that fills the database with Universities/Courses
├── src/
│   ├── controllers/    <-- The actual logic functions (e.g., login, fetch courses)
│   ├── middleware/     <-- Functions that run BEFORE controllers (e.g., check JWT token, upload files)
│   ├── routes/         <-- Maps URLs (like /api/auth/login) to the controller logic
│   ├── utils/          <-- Helper files (like db.js to export Prisma)
│   └── server.js       <-- The main entry point. Starts the Express server on port 5000.
├── uploads/            <-- Where user PDFs and resources are saved
├── .env                <-- Stores secret variables (Database URL, JWT Secret)
└── package.json        <-- Backend dependencies
```

### B. The Frontend: `PeerV3/academe-frontend/`
This folder is the React UI.
```text
academe-frontend/
├── src/
│   ├── components/     <-- Reusable UI pieces (e.g., Navbar.jsx)
│   ├── context/        <-- Global React state (e.g., AuthContext.jsx keeps the user logged in)
│   ├── pages/          <-- The main views/screens of your app
│   │   ├── Home.jsx           (Public landing page)
│   │   ├── Login.jsx & Signup.jsx (Auth pages)
│   │   ├── Dashboard.jsx      (Shows universities)
│   │   ├── UniversityPage.jsx (Shows courses)
│   │   ├── CoursePage.jsx     (Shows subjects by semester)
│   │   └── SubjectPage.jsx    (The main hub to upload resources & host sessions)
│   ├── App.jsx         <-- Defines the <Routes> matching URLs to the pages above
│   ├── index.css       <-- Base Tailwind styles and custom @apply classes
│   └── main.jsx        <-- The React entry point (wraps app in Auth/Google providers)
├── index.html          <-- The raw HTML template the browser loads first
├── tailwind.config.js  <-- Your custom colors (ink, chalk, paper) and fonts
└── package.json        <-- Frontend dependencies
```

---

## 3. How the Code Works (Data Flow)

When a user interacts with PeerLearn, here is how the frontend and backend talk to each other:

### 1. Authentication (Login / Signup)
*   **Frontend:** User types email/password in `Login.jsx` and hits submit.
*   **AuthContext.jsx:** Takes those details and makes an `axios.post('http://localhost:5000/api/auth/login')`.
*   **Backend (`authRoutes.js` -> `authController.js`):** Checks the email in PostgreSQL via Prisma. Compares the hashed password using `bcrypt`. If correct, it generates a JWT string using `jsonwebtoken` and sends it back.
*   **AuthContext.jsx:** Saves this JWT string in `localStorage` so the browser remembers it even if the user refreshes the page.

### 2. Viewing Protected Data (e.g., Courses or Subjects)
*   **Frontend:** User navigates to `/university/1`. `UniversityPage.jsx` makes an API request using `authAxios` (which automatically attaches the JWT to the request headers).
*   **Backend (`authMiddleware.js`):** Before letting the request hit the controller, the middleware intercepts it, verifies the JWT signature, and identifies *who* is making the request. If the token is missing or invalid, it returns a 401 Unauthorized error.
*   **Backend (`academyController.js`):** If valid, it fetches the courses for that university from Prisma and returns them as JSON.
*   **Frontend:** `UniversityPage.jsx` receives the JSON array and `map()`s over it to draw the cards on the screen.

---

## 4. API Endpoints Key (Cheatsheet)

All routes start with `http://localhost:5000/api`

### Auth (`/auth`)
*   `POST /auth/register` — Requires `{ name, email, password }`
*   `POST /auth/login` — Requires `{ email, password }`
*   `POST /auth/google` — Requires Google `{ idToken }`

### Academy (`/academy`)
*   `GET /academy/universities` — Public. Returns all universities.
*   `GET /academy/universities/:universityId/courses` — Protected. Returns courses.
*   `GET /academy/courses/:courseId/subjects` — Protected. Returns subjects.
*   `GET /academy/subjects/:subjectId` — Protected. Returns full subject details including resources and sessions.

### Resources (`/resources`)
*   `POST /resources/upload` — Protected. Requires a file (multipart/form-data) and `{ title, subjectId }`.
*   `POST /resources/:resourceId/rate` — Protected. Requires `{ isHelpful: boolean }`. Upvotes or downvotes.
*   `POST /resources/:resourceId/report` — Protected. Requires `{ reason: string }`. If reports >= 3, the resource is hidden.

### Sessions (`/sessions`)
*   `POST /sessions` — Protected. Requires `{ topic, date, time, meetLink, subjectId }`. Creates a live session card.

---

## 5. How to Modify the Project Manually

Here are common scenarios and exactly what files you need to touch:

### Scenario 1: I want to add a new page (e.g., an "About Us" page)
1.  **Create the UI:** Go to `academe-frontend/src/pages/` and create `About.jsx`.
2.  **Write React Code:** `const About = () => { return <div>About Us</div> }; export default About;`
3.  **Add the Route:** Open `academe-frontend/src/App.jsx`.
4.  **Import it:** `import About from './pages/About';`
5.  **Define URL:** Inside `<Routes>`, add `<Route path="/about" element={<About />} />`.

### Scenario 2: I want to add a new database column (e.g., adding `description` to `Course`)
1.  **Update Schema:** Open `academe-backend/prisma/schema.prisma`. Find `model Course` and add `description String?`.
2.  **Apply Migration:** In the terminal, run `npx prisma migrate dev --name add_course_desc`.
3.  **Update Controller:** If you want to return or update this new field, edit `academe-backend/src/controllers/academyController.js` to include it in the Prisma queries.
4.  **Update UI:** Go to `CoursePage.jsx` to render `course.description`.

### Scenario 3: I want to change a color or font
1.  **Tailwind Config:** Open `academe-frontend/tailwind.config.js`. 
2.  Change the hex codes inside `theme.extend.colors`. For example, change `ink: '#1B2A4A'` to whatever you want.
3.  **Restart Server:** You must restart `npm run dev` to see config changes.

### Scenario 4: I want to add a new API route (e.g., fetching a user's profile)
1.  **Create Controller:** Open `academe-backend/src/controllers/authController.js` and add a new function: `exports.getProfile = async (req, res) => { ... }`.
2.  **Expose Route:** Open `academe-backend/src/routes/authRoutes.js`. Add `router.get('/profile', authMiddleware, getProfile)`.
3.  **Fetch in Frontend:** Use `authAxios.get('/auth/profile')` inside a `useEffect` on your React page.
