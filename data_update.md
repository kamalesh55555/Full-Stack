# PeerLearn: Academic Data Update Guide

This guide explains how to update the academic database (**Universities**, **Courses**, and **Subjects**) whenever team members update the master Excel/spreadsheet.

---

## ⚡ How it Works Under the Hood

* The backend includes an automated seeder script at [`backend/prisma/seed.js`](file:///c:/Users/KAMALMONE/OneDrive/Desktop/FSD-PR/PeerV3/backend/prisma/seed.js).
* It reads [`backend/prisma/data.csv`](file:///c:/Users/KAMALMONE/OneDrive/Desktop/FSD-PR/PeerV3/backend/prisma/data.csv).
* The script uses **safe upsert logic**:
  - If a University already exists, it will not create a duplicate.
  - If a Course already exists under that University, it will not create a duplicate.
  - If a Subject code already exists under that Course, it will not duplicate it.
  - Only **new** entries will be added to the database.
* Because your local [`backend/.env`](file:///c:/Users/KAMALMONE/OneDrive/Desktop/FSD-PR/PeerV3/backend/.env) points to your live **Neon PostgreSQL cloud database**, running the seed command locally updates the **production database in real-time**.
* **Zero downtime & zero redeploy:** As soon as the script finishes, everyone visiting the live website ([https://full-stack-chi-eight.vercel.app](https://full-stack-chi-eight.vercel.app)) will immediately see the new data!

---

## 📋 Step 1: Format the Excel Spreadsheet

Ensure the Excel spreadsheet columns match this exact header order on Row 1:

```text
University,Programme,Branch,Semester,SubjectCode,SubjectName
```

### Column Specifications:

| Column | Description | Example |
| :--- | :--- | :--- |
| **University** | Name of the institution | `SRM KTR`, `ANNA UNIV` |
| **Programme** | Degree programme | `B.Tech`, `B.E`, `MCA` |
| **Branch** | Department / Specialization | `CSE`, `ECE`, `IT` |
| **Semester** | Numerical semester (1 to 8) | `1`, `3`, `5` |
| **SubjectCode** | Unique course / subject code | `21CSC201J`, `CS3352` |
| **SubjectName** | Full title of the subject | `Data Structures and Algorithms` |

### Sample Rows:

```csv
University,Programme,Branch,Semester,SubjectCode,SubjectName
SRM KTR,B.Tech,CSE,1,21LEH102T,Chinese
SRM KTR,B.Tech,CSE,1,21MAB101T,Calculus and Linear Algebra
SRM KTR,B.Tech,CSE,3,21CSC201J,Data Structures and Algorithms
SRM NCR,MCA,Computer Science,1,CS3352,Foundations of Data Science
ANNA UNIV,B.E,ECE,2,EC3251,Circuit Analysis
```

> ⚠️ **Important:** Avoid extra commas inside names (e.g., use `B.Tech` instead of `B.Tech, Honors`).

---

## 💾 Step 2: Export as CSV

1. In Microsoft Excel (or Google Sheets):
   - Click **File** → **Save As** (or **Download** in Google Sheets).
2. Choose file type: **CSV (Comma delimited) (*.csv)**.
3. Save or copy the exported file to:
   ```text
   PeerV3/backend/prisma/data.csv
   ```
   *(Replace/overwrite the previous `data.csv` file).*

---

## 🚀 Step 3: Push Data to the Live Neon Database

1. Open PowerShell on your computer.
2. Navigate to the `backend` folder and run the seed script:

```powershell
cd c:\Users\KAMALMONE\OneDrive\Desktop\FSD-PR\PeerV3\backend
node prisma/seed.js
```

3. You will see terminal output showing newly created universities, courses, and subjects:
```text
Starting the seeding process...
Created University: SRM KTR
Created Course: B.Tech CSE under SRM KTR
Added Subject: 21CSC201J - Data Structures and Algorithms
...
✅ Database seeding completed successfully!
```

---

## 🔍 Step 4: Verification

1. Open your live website:  
   👉 **[https://full-stack-chi-eight.vercel.app](https://full-stack-chi-eight.vercel.app)**
2. Click into the University and Course you just updated.
3. You will immediately see the new semester categories and subjects available for students to share notes, upload resources, and host peer study sessions!
