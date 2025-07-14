from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import asyncio
import uuid
from datetime import datetime
import json
from enum import Enum

app = FastAPI(title="Health Task Orchestrator API", version="1.0.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=False,  # Set to False when using allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in-progress"
    PAUSED = "paused"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class CreateTaskRequest(BaseModel):
    title: str
    description: str

class Task(BaseModel):
    id: str
    title: str
    description: str
    status: TaskStatus
    progress: float
    result: Optional[str] = None
    createdAt: datetime
    startedAt: Optional[datetime] = None
    completedAt: Optional[datetime] = None

# In-memory storage (in production, use a database)
tasks: Dict[str, Task] = {}
task_tasks: Dict[str, asyncio.Task] = {}

async def simulate_task_execution(task_id: str):
    """Simulate a long-running task that takes ~30 seconds"""
    task = tasks[task_id]
    
    # Update task status to in-progress
    task.status = TaskStatus.IN_PROGRESS
    task.startedAt = datetime.now()
    task.progress = 0.0
    
    # Simulate 30-second execution with progress updates
    total_steps = 60  # 30 seconds with 0.5 second intervals
    step_duration = 0.5
    
    for step in range(total_steps):
        # Check if task was cancelled or paused
        if task.status == TaskStatus.CANCELLED:
            return
        
        if task.status == TaskStatus.PAUSED:
            # Wait until resumed
            while task.status == TaskStatus.PAUSED:
                await asyncio.sleep(0.1)
                if task.status == TaskStatus.CANCELLED:
                    return
        
        # Update progress
        task.progress = min((step + 1) / total_steps * 100, 100.0)
        
        # Simulate some work
        await asyncio.sleep(step_duration)
    
    # Task completed
    task.status = TaskStatus.COMPLETED
    task.progress = 100.0
    task.completedAt = datetime.now()
    task.result = f'Task "{task.title}" completed successfully! Healthcare data processed.'

@app.post("/api/tasks", response_model=Task)
async def create_task(request: CreateTaskRequest):
    """Create a new task"""
    task_id = str(uuid.uuid4())
    
    task = Task(
        id=task_id,
        title=request.title,
        description=request.description,
        status=TaskStatus.PENDING,
        progress=0.0,
        createdAt=datetime.now()
    )
    
    tasks[task_id] = task
    return task

@app.get("/api/tasks", response_model=list[Task])
async def get_all_tasks():
    """Get all tasks"""
    return sorted(
        list(tasks.values()),
        key=lambda x: x.createdAt,
        reverse=True
    )

@app.get("/api/tasks/{task_id}", response_model=Task)
async def get_task(task_id: str):
    """Get a specific task by ID"""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    return tasks[task_id]

@app.post("/api/tasks/{task_id}/run", response_model=Task)
async def run_task(task_id: str):
    """Start executing a task"""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = tasks[task_id]
    
    if task.status not in [TaskStatus.PENDING, TaskStatus.PAUSED]:
        raise HTTPException(status_code=400, detail="Task cannot be started")
    
    # If task is already running, return current state
    if task_id in task_tasks and not task_tasks[task_id].done():
        return task
    
    # Start the task execution
    task_tasks[task_id] = asyncio.create_task(simulate_task_execution(task_id))
    
    return task

@app.post("/api/tasks/{task_id}/pause", response_model=Task)
async def pause_task(task_id: str):
    """Pause a running task"""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = tasks[task_id]
    
    if task.status != TaskStatus.IN_PROGRESS:
        raise HTTPException(status_code=400, detail="Task is not running")
    
    task.status = TaskStatus.PAUSED
    return task

@app.post("/api/tasks/{task_id}/resume", response_model=Task)
async def resume_task(task_id: str):
    """Resume a paused task"""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = tasks[task_id]
    
    if task.status != TaskStatus.PAUSED:
        raise HTTPException(status_code=400, detail="Task is not paused")
    
    # Simply change status back to in-progress to unblock the paused task
    task.status = TaskStatus.IN_PROGRESS
    
    return task

@app.post("/api/tasks/{task_id}/cancel", response_model=Task)
async def cancel_task(task_id: str):
    """Cancel a task"""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = tasks[task_id]
    
    if task.status in [TaskStatus.COMPLETED, TaskStatus.CANCELLED]:
        raise HTTPException(status_code=400, detail="Task cannot be cancelled")
    
    task.status = TaskStatus.CANCELLED
    task.result = "Task was cancelled by user"
    
    # Cancel the background task if it exists
    if task_id in task_tasks and not task_tasks[task_id].done():
        task_tasks[task_id].cancel()
    
    return task

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 