# Kursath Foundation Full-Stack Portal

Welcome to the **Kursath Foundation** web portal. This full-stack MERN application is designed to connect students and community members with opportunities, including scholarships, government welfare schemes, hostel accommodations, livelihood support programs, and career/internship opportunities.

The portal features real-time dynamic English-Hindi translation, an AI-powered national exam calendar with suggestion chips, an admin control center with role-based access control, secure email password recovery, and student bookmarking/profile dashboards.

---

## 🏗️ Architecture Overview

The project is structured as a monorepo containing:
* **Frontend (`/frontend`)**: React, Vite, Tailwind CSS, Lucide Icons, and React Router.
* **Backend (`/backend`)**: Node.js, Express, Mongoose, JWT auth, and Nodemailer.
* **Self-Contained Database**: Automatically spins up an in-memory MongoDB database instance (`mongodb-memory-server`) at startup, falling back to a local JSON file (`data_fallback.json`) if MongoDB is unavailable.

---

## 🛠️ Step-by-Step Local Setup

Follow these steps to set up and run the application locally on your computer.

### Prerequisites
Make sure you have **Node.js** (v18 or higher) and **npm** installed on your system. You can verify this by running:
```bash
node -v
npm -v
```

---

### Step 1: Install Dependencies
The project uses a root-level script to install dependencies for the root, frontend, and backend packages in a single command. Run the following command in the project root directory:
```bash
npm run install-all
```
*This command runs `npm install` locally in the root, `/backend`, and `/frontend` folders.*

---

### Step 2: Environment Configuration
Create environment files to configure JWT tokens, mail servers, and Google OAuth.

#### Frontend Environment
Create a file named `.env` in the `/frontend` directory:
```env
# Google OAuth 2.0 Client ID for Frontend Sign-In Button (optional for testing)
VITE_GOOGLE_CLIENT_ID=412753506000-p3jug0auosp5b61b9hoc0roj5827upf6.apps.googleusercontent.com
```

#### Backend Environment
Create a file named `.env` in the `/backend` directory:
```env
PORT=5000
JWT_SECRET=kursath_jwt_secret_token

# Node Environment
NODE_ENV=development

# SMTP Email Configuration (Used for password reset confirmation)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@kursathfoundation.org
SMTP_PASS=your_email_password
```
*(If SMTP is not configured, password reset tokens will be logged directly to the backend server console for testing)*

---

### Step 3: Run the Local Servers
To run both the frontend and backend concurrently, run the following command in the root directory:
```bash
npm run dev
```

This starts:
1. **Backend Server**: listening on [http://localhost:5000/](http://localhost:5000/)
2. **Frontend Development Server (Vite)**: listening on [http://localhost:5173/](http://localhost:5173/)

> [!NOTE]
> **macOS AirPlay Port Conflict (Port 5000):**
> On macOS, port `5000` is often pre-bound by the built-in **AirPlay Receiver** service. If you get a port conflict error when starting the backend server on a Mac:
> 1. Set the port to `5001` in `/backend/.env`:
>    ```env
>    PORT=5001
>    ```
> 2. Update the frontend proxy target in `/frontend/vite.config.js` to point to port `5001`:
>    ```javascript
>    target: 'http://localhost:5001',
>    ```

---

### Step 4: Automatic Database Seeding
At startup, the backend automatically checks if the database is empty. If it is empty, the application will:
* Spin up a local in-memory MongoDB database instance on port `27017`.
* Automatically seed **14 sample opportunities** (scholarships, pensions, career stories).
* Seed **6 volunteers** for the volunteer support network cards.
* Seed the default **Admin user** (`info@kursathfoundation.org`).

*(You can also trigger seeding manually at any time by running `npm run seed` in the root folder).*

---

## 🔑 Login Credentials & Testing

Open your browser and navigate to [http://localhost:5173/](http://localhost:5173/) to interact with the site.

### 1. Admin Login (Manual Form)
* **Username**: `info@kursathfoundation.org`
* **Password**: `kursath@2000`
*(Use this to log in to the admin panel, manage sub-admin team permissions, and add or resolve contact messages).*

### 2. Standard Student Login (Mock Google Sign-In)
To test student dashboard features (initials avatar dropdown, opportunity saving/bookmarking, profile forms, email alerts) without setting up Google credentials:
1. Go to the Sign In page.
2. Click the **Mock Google Sign-In (Local Testing)** button.
3. Enter `student@example.com` (or any testing email) and click OK.
4. You will be logged in immediately as a standard user (`role: 'user'`).
