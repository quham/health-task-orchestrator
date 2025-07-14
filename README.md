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
- **API Documentation**: http://localhost:8000/docs

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

## API Documentation

When running the backend, you can access the interactive API documentation at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

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

## Key Technical Decisions

### Frontend
- **React with TypeScript**: For type safety and better developer experience
- **Vite**: For fast development and optimized builds
- **Tailwind CSS**: For utility-first styling and rapid UI development
- **Shadcn/ui**: For pre-built, accessible UI components
- **Custom hooks**: For reusable state management logic
- **API polling**: For real-time task progress updates

### Backend
- **FastAPI**: For modern, fast Python web framework with automatic API documentation
- **Pydantic**: For data validation and serialization
- **Async/await**: For non-blocking task execution
- **In-memory storage**: For simplicity (in production, use a database)
- **CORS middleware**: For frontend integration

### Architecture
- **RESTful API**: Clean, predictable API design
- **Separation of concerns**: Clear separation between frontend and backend
- **Docker containerization**: For consistent deployment across environments
- **Environment variables**: For configuration management

## Development Notes

### AI Assistance
This project was developed with assistance from AI tools:
- **GitHub Copilot**: For code completion and suggestions
- **ChatGPT**: For architectural decisions and problem-solving
- **Cursor**: For intelligent code editing and refactoring

### Task Simulation
Tasks simulate 30-second long-running operations with:
- Progress updates every 0.5 seconds
- Pause/resume functionality
- Cancellation support
- Real-time status tracking

### Error Handling
- Comprehensive error handling on both frontend and backend
- User-friendly error messages
- Graceful degradation for network issues

## Production Considerations

For production deployment, consider:

1. **Database**: Replace in-memory storage with a proper database (PostgreSQL, MongoDB)
2. **Authentication**: Add user authentication and authorization
3. **Logging**: Implement structured logging
4. **Monitoring**: Add health checks and metrics
5. **Security**: Implement rate limiting, input validation, and security headers
6. **Scaling**: Use message queues for task processing (Celery, Redis)
7. **Environment**: Use environment-specific configuration files

## Testing

To run tests (when implemented):

```bash
# Frontend tests
npm test

# Backend tests
cd backend
python -m pytest
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
