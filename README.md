# StudySync - Student Study Planner

## Project Overview

StudySync is a full-stack student study planner developed during the DecodeLabs Full Stack Development Internship 2026.

The application allows students to manage academic tasks, organize study activities, track completed work, and store task data permanently using a database.

## Project Development Stages

### Week 1 - Responsive Frontend Interface

The frontend was created using semantic HTML, responsive CSS, and JavaScript.

Main features:

- Responsive mobile-first design
- Semantic HTML5 structure
- Mobile navigation menu
- Dark mode
- Add new tasks
- Mark tasks as completed
- Delete tasks
- Task progress counter
- Weekly study schedule
- Responsive layout for mobile, tablet, and desktop

### Week 2 - Backend API Development

A backend API was developed using Node.js and Express.js.

API features:

- Fetch all tasks
- Fetch a specific task
- Add a new task
- Update a task
- Delete a task
- Validate user input
- Return JSON responses
- Handle HTTP status codes and errors

### Week 3 - Database Integration

The backend was connected to a SQLite database for permanent data storage.

Database features:

- Tasks table schema
- Create operation
- Read operation
- Update operation
- Delete operation
- Permanent storage after browser refresh
- Permanent storage after server restart
- Automatic task IDs

## Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js
- CORS

### Database

- SQLite
- Node SQLite module

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check API status |
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/:id` | Get one task |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

## Project Structure

```text
StudySync-Project
├── backend
│   ├── database.js
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
├── frontend
│   ├── index.html
│   ├── script.js
│   └── style.css
├── .gitignore
└── README.md


How to Run the Project
1. Install Node.js

Make sure Node.js and npm are installed.

Check versions:

node -v
npm -v
2. Open the Backend Folder
cd backend
3. Install Dependencies
npm install
4. Start the Backend Server
node server.js

The backend will run at:

http://localhost:3000
5. Open the Frontend

Open the frontend folder and run index.html using the VS Code Live Server extension.

The frontend will connect to the backend API running on port 3000.

Testing Completed

The following tests were completed successfully:

Tasks load from the backend
New tasks are added
Empty task titles are rejected
Tasks can be marked complete
Tasks can be deleted
Data remains saved after page refresh
Data remains saved after backend restart
Invalid routes return a 404 response
Database CRUD operations work correctly

Author:
Rubab

Internship:

DecodeLabs Full Stack Development Internship
Batch 2026

This README clearly documents the responsive frontend developed in Week 1, the backend API created in Week 2, and the database integration completed in Week 3.
