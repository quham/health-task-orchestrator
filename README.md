# Health Task Orchestrator

A full-stack web application that allows users to manage and execute long-running tasks with real-time progress tracking, pause/resume functionality, and task cancellation.

## Features

- **Task Management**: Create, view, and manage tasks with titles and descriptions
- **Task Execution**: Start tasks that simulate 30-second long-running operations
- **Real-time Progress**: Live progress tracking with percentage completion
- **Task Control**: Pause, resume, and cancel running tasks
- **Status Tracking**: Monitor task status (pending, in-progress, paused, completed, cancelled)
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Docker Support**: Easy deployment with Docker and Docker Compose

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite**
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components

### Backend **Python 3.11** 
docker-compose up --build

## Quick Start with Docker

The easiest way to run the application is using Docker Compose:

```bash
# Clone the repository
git clone <repository-url>
cd health-task-orchestrator

# Build and run with Docker Compose
docker-compose up --build
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

## Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at http://localhost:5173

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at http://localhost:8000

## API Endpoints

### Tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{task_id}` - Get a specific task
- `POST /api/tasks/{task_id}/run` - Start executing a task
- `POST /api/tasks/{task_id}/pause` - Pause a running task
- `POST /api/tasks/{task_id}/resume` - Resume a paused task
- `POST /api/tasks/{task_id}/cancel` - Cancel a task

### Health Check
- `GET /health` - Health check endpoint


## Project Structure

```
health-task-orchestrator/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   ├── types/             # TypeScript type definitions
│   └── pages/             # Page components
├── backend/               # Backend source code
│   ├── main.py           # FastAPI application
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile        # Backend Docker configuration
├── Dockerfile            # Frontend Docker configuration
├── docker-compose.yml    # Docker Compose configuration
└── README.md             # This file
```

This has been kept quite simple and general and not specific to healthcare setting at the moment.

Basic Additions if continued:
More properties for task e.g. due date, category, patient, priority
Templates for different kinds of tasks
Login and Auth
From in memory storage to DB with Auth
Test suite
Tailor to healthcare setting via discussions with healthcare professionals
Task Anyalytics: completion rates, completion time etc.

