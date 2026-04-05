# Smart Task Manager - MERN App

## How to Run

### Step 1 - Open MongoDB Compass
Connect to: mongodb://localhost:27017
(Database "smarttaskdb" will be created automatically)

### Step 2 - Run Backend
cd backend
npm install
npm start

Backend: http://localhost:5000

### Step 3 - Run Frontend (new terminal)
cd frontend
npm install
npm start

Frontend: http://localhost:3000

---

## API Endpoints
POST   /api/auth/register   - Register
POST   /api/auth/login      - Login
GET    /api/tasks           - Get tasks (auth)
POST   /api/tasks           - Create task (auth)
PUT    /api/tasks/:id       - Update task (auth)
DELETE /api/tasks/:id       - Delete task (auth)
