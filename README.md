# MFA Connect

Static MFA portal frontend with Vercel serverless backend routes for MongoDB persistence.

## Backend (Vercel + MongoDB)
- const API = 'https://mfaconnect.vercel.app/' is set in portal-shared.js, index.html, and student-portal-mfa.html.
- Serverless routes:
  - GET/POST /api/db – read/write the portal dataset in MongoDB (portal collection, document _id: "portal").
  - POST /api/login – validates credentials against MongoDB and returns the account record.
- MongoDB helper: lib/mongodb.js (connection cached for serverless).

### Environment variables (Vercel project settings)
- MONGODB_URI (required) – MongoDB connection string.
- MONGODB_DB (optional, default: mfa_connect) – database name.

### Behavior
- Login syncs portal data from /api/db, attempts /api/login, and falls back to local/demo data if the API is unavailable.
- Dashboard pages call syncDBFromServer() on load to refresh data from MongoDB.
- saveDB() writes to browser localStorage and posts updates to /api/db for persistence.
- First deploy/first request seeds the portal document with default/demo data if missing.

## Local/dev notes
- Frontend pages are static HTML/JS/CSS and can be opened locally; without the backend they use localStorage/demo behavior.
- Deploying to Vercel serves the static files and /api/* functions together.
