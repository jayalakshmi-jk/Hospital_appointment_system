# Hospital Appointment System — MySQL/phpMyAdmin → Supabase (Postgres) migration

## What changed
- `db.js`: `mysql2` → `pg` (Postgres), reading connection string from `.env`
- `routes/admin.js`, `routes/doctor.js`, `routes/patient.js`: converted from
  mysql2 callback style + `?` placeholders → pg async/await + `$1, $2...` placeholders
- `database.sql` → `database/schema.sql`: converted to Postgres syntax
  (SERIAL instead of AUTO_INCREMENT, TIMESTAMP instead of DATETIME, triggers
  added to replicate MySQL's `ON UPDATE CURRENT_TIMESTAMP`)
- `package.json`: removed `mysql2`, added `pg` + `dotenv`
- Frontend (`frontend/` folder) — untouched. No changes needed there since it
  just calls your API endpoints, which kept the same routes/behavior.

## Steps to get this running

### 1. Create a Supabase project
Go to https://supabase.com → New Project → note your database password
(you set it when creating the project).

### 2. Run the schema
Supabase Dashboard → SQL Editor → New query → paste the contents of
`database/schema.sql` → Run.

### 3. Get your connection string
Project Settings → Database → Connection string → URI tab.
Copy it, replace `[YOUR-PASSWORD]` with your actual DB password.

If you're deploying somewhere that blocks direct outbound connections on
port 5432 (some free hosts do), use the **Transaction pooler** connection
string instead (port 6543) shown on the same page.

### 4. Set up your .env
```
cd backend
cp .env.example .env
```
Paste your real `DATABASE_URL` into `.env`.

### 5. Install & run
```
cd backend
npm install
npm run start        # or: npm run up (nodemon, auto-restart)
```

You should see:
```
Database Connected!!!
server connected on port 3000!!!
```

### 6. Frontend
No changes needed — it still talks to the same routes
(`/patients/login`, `/doctor/login`, `/admin/...` etc.) on whatever host you
deploy the backend to. Just make sure the frontend's API base URL points to
wherever you deploy this Express server (Render, Railway, etc. — Supabase
only hosts the database, not your Node backend).

## Note on a possible column-name mixup
`patients` table has both `password` (plain text) and `hassed_password`
(bcrypt hash) columns — this was already in your original design and I kept
it as-is so nothing else breaks. Just flagging it: storing the plain
`password` column isn't great practice for a real app, though fine for a
DBMS course project. Let me know if you want it removed.
