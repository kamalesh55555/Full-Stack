# Academe Project — Complete Rebuild Summary

## What Was Fixed

### 🔴 Critical Bugs Fixed

| Problem | Root Cause | Fix |
|---------|-----------|-----|
| Home page shows "Loading universities..." forever | The `/api/academy/universities` endpoint required a JWT token, but the Home page is visited by unauthenticated users | Made the universities endpoint **public** (no auth required) |
| Login state lost on page refresh | `AuthContext` was hardcoding `{ id: 1, name: 'Student' }` instead of reading the real user data | User data is now persisted in `localStorage` and restored on refresh |
| "Browse Courses" did nothing | Dashboard had no click handler or navigation | Dashboard now links to `/university/:id` which shows the courses |
| No way to view subjects | No CoursePage existed | Created `CoursePage.jsx` that groups subjects by semester |
| No way to upload/view resources | No SubjectPage existed | Created `SubjectPage.jsx` with upload form, rating, and reporting |
| No way to create/join live sessions | No session UI existed | Added session creation form and listing inside the Subject page |
| No Registration page | The Signup route existed but was incomplete | Created complete `Signup.jsx` with validation |

### 🟢 New Pages Created

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Home | Hero section + feature cards + public university list |
| `/login` | Login | Email/password + Google sign-in |
| `/signup` | Signup | Full registration form with password validation |
| `/dashboard` | Dashboard | Authenticated hub with quick-action cards + university list |
| `/university/:id` | UniversityPage | Lists all courses under a university |
| `/course/:id` | CoursePage | Lists all subjects grouped by semester |
| `/subject/:id` | SubjectPage | **Core page** — Upload resources, rate, report, host/join sessions |

---

## Where User Data is Stored

> [!IMPORTANT]
> All user accounts, uploaded resources, and session data are stored in your **PostgreSQL database** called `academe`.

### How to View Your Data
Open a terminal in `PeerV3/academe-backend` and run:
```bash
npx prisma studio
```
This opens a visual database browser at `http://localhost:5555` where you can:
- See all registered users in the **User** table (passwords are hashed with bcrypt)
- See all universities, courses, and subjects
- See uploaded resources, ratings, and reports
- See scheduled live sessions

### Database Tables Quick Reference

| Table | What it Stores |
|-------|---------------|
| `User` | Email, name, hashed password, Google ID, suspended status |
| `University` | University name (e.g., "SRM KTR") |
| `Course` | Programme + branch (e.g., "B.Tech CSE") linked to a university |
| `Subject` | Subject code, name, semester — linked to a course |
| `Resource` | Uploaded file title + path — linked to subject + uploader |
| `ResourceRating` | Upvote/downvote — linked to resource + user |
| `Report` | Spam/abuse reports — linked to resource + user |
| `LiveSession` | Topic, date, time, Meet link — linked to subject + host |

---

## How to Run the Project

### Step 1: Start the Backend
```bash
cd PeerV3/academe-backend
node src/server.js
```
> Backend runs on **http://localhost:5000**

### Step 2: Start the Frontend
```bash
cd PeerV3/academe-frontend
npm run dev -- --force
```
> Frontend runs on **http://localhost:5173**

### Step 3: Test the Full Flow
1. Open **http://localhost:5173** → You see the Home page with universities
2. Click **Sign up** → Create an account with any email/password
3. You're redirected to **Dashboard** → Click a university
4. See the **courses** → Click a course
5. See **subjects grouped by semester** → Click a subject
6. On the subject page you can:
   - **Upload** a PDF/file
   - **View** uploaded resources
   - **Upvote / Downvote** resources
   - **Report** spam resources
   - **Host** a live session with a Google Meet link
   - **Join** existing sessions

---

## User Flow Diagram

```
Home (public)
  ├── See all universities
  ├── Sign up / Log in
  │
  └── Dashboard (authenticated)
        ├── Quick action cards
        └── University list
              └── UniversityPage → shows courses
                    └── CoursePage → shows subjects by semester
                          └── SubjectPage → THE MAIN PAGE
                                ├── 📄 Resources tab
                                │     ├── Upload form
                                │     └── Resource list (view, rate, report)
                                └── 🎥 Sessions tab
                                      ├── Create session form
                                      └── Session list (join via Meet)
```
