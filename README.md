# TECH ASSESSMENT

This repository contains both the frontend (React/Vite) and the backend (Node.js/Express) for the IMDB Clone application.

## Directory Structure

- `client/` - Frontend application
- `src/` - Backend source code
- `config/` - Configuration files
- `database/` - Database seeds, migrations, and SQLite file
- `logs/` - Application logs
- `uploads/` - User-uploaded files

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm

### Installation & Running Locally

1. Clone the repository and navigate to the project root.
2. Copy `.env.example` to `.env` (if applicable) and fill in your variables.
3. Install root and client dependencies:
   ```bash
   npm install
   cd client && npm install && cd ..
   ```
4. Create the local SQLite database file:
   - **Mac/Linux:**
     ```bash
     touch dev.sqlite3
     ```
   - **Windows (PowerShell):**
     ```powershell
     New-Item dev.sqlite3 -Type File
     ```
   *(Or simply create a new empty file named `dev.sqlite3` in the root folder using your code editor).*
5. Set up the database schema and mock data:
   ```bash
   npx knex migrate:latest
   npm run seed
   ```
6. Run both the backend and frontend concurrently:
   ```bash
   npm run dev
   ```
   The frontend will start at `http://localhost:5173` and the backend at `http://localhost:3000`.

## Technical Assessment Instructions

This repository contains several intentional bugs for the purpose of a technical debugging interview.

### Your Task:

1. Run the application locally and interact with the UI.
2. Identify the bugs across the frontend, API, and backend/database layers.
3. Debug and fix the issues you encounter.

### Submission Instructions
To evaluate your debugging skills, please follow these submission guidelines carefully:

1. Create a new repository on your GitHub account and push this codebase to it.
2. Debug the application and commit your code fixes directly to your new repository.
3. For every bug you find and fix, document it in a Google Doc using the format provided in the `Candidate_Bug_Report.md` template. Please explain the symptom and your fix in plain English.
4. Add the link to your Google Doc at the top of your repository's `README.md` (make sure the Google Doc permissions are set to "Anyone with the link can view").
5. Share the link to your new repository with your recruiter or interviewer to complete the assessment.
