# Kursath Foundation Full-Stack App

A full-stack web application for the Kursath Foundation, built with a React + Vite frontend and an Express.js backend. The app includes scholarship and scheme opportunities, volunteer listings, contact form handling, admin authentication, and a fallback local JSON data store when MongoDB is unavailable.

## Project Structure

- `package.json` - root workspace commands and shared scripts
- `backend/` - Express server, API routes, MongoDB connection, models, authentication, and data seeding
- `frontend/` - Vite + React application with Tailwind CSS, routes, and UI pages

## Key Features

- Public listing of opportunities and volunteers
- Contact form submission
- Admin authentication with JWT
- User profile and saved opportunity bookmarking
- Admin-only create/update/delete for opportunities and messages
- Automatic seeding of sample opportunities, volunteers, and admin user
- Fallback storage using `mongodb-memory-server` or `backend/data_fallback.json`

## Prerequisites

- Node.js 18+ and npm
- Optional: local MongoDB instance for persistent storage

## Setup

1. Install dependencies for root, backend, and frontend:

```bash
npm run install-all
```

2. Seed the backend database or fallback data file:

```bash
npm run seed
```

3. Start the development servers:

```bash
npm run dev
```

4. Open the frontend in your browser at:

```text
http://localhost:5173
```

The backend runs on `http://localhost:5001` by default.

## Environment Variables

The backend uses `.env` values from `backend/.env`. Important variables include:

- `PORT` - backend port (default: `5001`)
- `MONGO_URI` - optional MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - SMTP settings for password reset emails
- `GOOGLE_CLIENT_ID` - optional Google OAuth client ID for Google login support

## Admin Credentials

The seed script creates a default admin user:

- Username: `admin`
- Password: `password123`

> Change this password before deploying to production.

## Running the Backend Alone

```bash
cd backend
npm start
```

Or use nodemon during development:

```bash
cd backend
npm run server
```

## Running Backend Tests

```bash
cd backend
npm test
```

## Running the Frontend Alone

```bash
cd frontend
npm run dev
```

## API Overview

- `GET /api/opportunities` - list all opportunities
- `GET /api/opportunities?category=` - filter opportunities by category
- `POST /api/opportunities` - create opportunity (admin/edit permission)
- `PUT /api/opportunities/:id` - update opportunity (admin/edit permission)
- `DELETE /api/opportunities/:id` - delete opportunity (admin/delete permission)
- `POST /api/contact` - submit contact message
- `GET /api/contact` - list contact messages (admin only)
- `PUT /api/contact/:id` - update message status (admin/edit permission)
- `POST /api/auth/login` - login and receive JWT
- `GET /api/auth/user` - get authenticated user info
- `GET /api/auth/users` - list users (admin only)
- `POST /api/auth/save-opportunity/:id` - bookmark opportunity
- `DELETE /api/auth/save-opportunity/:id` - remove bookmark

## Frontend Proxy Configuration

The frontend proxies API requests to the backend via `frontend/vite.config.js`:

```js
proxy: {
  '/api': {
    target: 'http://localhost:5001',
    changeOrigin: true,
    secure: false
  }
}
```

## Notes

- The backend can use a production MongoDB instance if `MONGO_URI` is set.
- If MongoDB is unavailable, the backend falls back to an in-memory database using `mongodb-memory-server`, then to the local file `backend/data_fallback.json`.
- Use `npm run build` inside `frontend/` to generate production-ready static assets.

## License

This repository does not include a license file. Add one if you publish or share this project publicly.
