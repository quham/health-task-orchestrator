# Healthcare Task Manager

A React-based task management system designed for healthcare professionals to manage and execute long-running operations with real-time monitoring capabilities.

## Features

- **Task Creation**: Simple form to create tasks with title and description
- **Task Management**: Run, pause, resume, and cancel operations
- **Real-time Progress**: Live progress indicators for running tasks (~30 seconds execution)
- **Status Tracking**: Visual status indicators (Pending, In Progress, Paused, Completed, Cancelled)
- **Mock Backend**: Simulated API with realistic task execution behavior
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Date Handling**: date-fns
- **Mock API**: Custom service with simulated async operations

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Local Development

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd healthcare-task-manager
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

### Docker Deployment

1. **Build and run with Docker:**
   ```bash
   docker build -t healthcare-task-manager .
   docker run -p 3000:3000 healthcare-task-manager
   ```

2. **Or use Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   Navigate to `http://localhost:3000`

## Usage Guide

### Creating Tasks
1. Use the "Create New Task" form on the left
2. Enter a descriptive title and optional description
3. Click "Create Task" to add it to the task list

### Managing Tasks
- **Run**: Start task execution (takes ~30 seconds)
- **Pause**: Temporarily stop a running task
- **Resume**: Continue a paused task from where it left off
- **Cancel**: Stop and mark task as cancelled

### Task Status
- **Pending**: Task created but not started
- **In Progress**: Task currently executing with progress indicator
- **Paused**: Task temporarily stopped, can be resumed
- **Completed**: Task finished successfully with results
- **Cancelled**: Task stopped by user action

## Architecture & Technical Decisions

### Frontend Architecture
- **Component-based**: Modular React components for reusability
- **Custom Hooks**: `useTasks` hook encapsulates all task-related state and operations
- **Type Safety**: Full TypeScript implementation with proper interfaces
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Mock Backend Simulation
- **Realistic Timing**: 30-second task execution with 500ms progress updates
- **State Persistence**: In-memory task storage with proper state management
- **Error Handling**: Comprehensive error states and user feedback
- **Progress Tracking**: Real-time progress updates during task execution

### Key Design Patterns
- **Service Layer**: Separated API logic in `mockApiService`
- **Custom Hooks**: Centralized state management with `useTasks`
- **Component Composition**: Reusable UI components with clear props interfaces
- **Error Boundaries**: Toast notifications for user feedback

### Assumptions Made
1. Tasks are simple operations without complex dependencies
2. Progress is linear and can be simulated with time-based increments
3. No user authentication required for this demo
4. Tasks don't persist between browser sessions (in-memory storage)
5. Single-user application (no concurrent user handling)

## File Structure

```
src/
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── TaskCard.tsx     # Individual task display
│   ├── TaskForm.tsx     # Task creation form
│   └── TaskList.tsx     # Task list container
├── hooks/
│   └── useTasks.ts      # Task management hook
├── services/
│   └── mockApi.ts       # Simulated backend API
├── types/
│   └── task.ts          # TypeScript interfaces
└── pages/
    └── Index.tsx        # Main application page
```

## Future Enhancements

- Real backend API integration
- Task persistence with database
- User authentication and multi-tenancy
- Task scheduling and dependencies
- Advanced progress indicators
- Task history and analytics
- Export functionality
- WebSocket support for real-time updates

## Testing

To run the application and test functionality:

1. Create multiple tasks with different titles
2. Start a task and observe the progress indicator
3. Test pause/resume functionality mid-execution
4. Cancel tasks at different stages
5. Verify status updates and result displays

## Contributing

This project was built as a technical demonstration. For production use, consider:

- Adding comprehensive unit and integration tests
- Implementing proper error boundaries
- Adding accessibility features
- Optimizing for performance with large task lists
- Implementing proper logging and monitoring

## License

This project is for demonstration purposes only.
