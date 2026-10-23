# Amader Bazar
Colorful React + PHP + MySQL e-commerce starter.

## Run frontend
1. Install Node.js and PHP/MySQL (XAMPP is fine).
2. Open terminal in `frontend` and run `npm install`, then `npm run dev`.
3. Copy `backend` into your XAMPP `htdocs` folder as `amader-bazar-api`.
4. Import `database/schema.sql` in phpMyAdmin.
5. Update database credentials in `backend/config.php` if needed.

## Important
This is a starter for local development. Before production, configure HTTPS, strong database credentials, backups, rate limiting, and a secure admin account. Never publish default credentials. API endpoints use password hashing and server-side role checks.
