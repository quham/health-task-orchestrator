import { Task, CreateTaskRequest } from '@/types/task';

class MockApiService {
  private tasks: Map<string, Task> = new Map();
  private progressIntervals: Map<string, NodeJS.Timeout> = new Map();

  async createTask(request: CreateTaskRequest): Promise<Task> {
    const task: Task = {
      id: crypto.randomUUID(),
      title: request.title,
      description: request.description,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
    };
    
    this.tasks.set(task.id, task);
    return task;
  }

  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getTask(id: string): Promise<Task | null> {
    return this.tasks.get(id) || null;
  }

  async runTask(id: string, onProgress?: (task: Task) => void): Promise<Task> {
    const task = this.tasks.get(id);
    if (!task) throw new Error('Task not found');
    
    if (task.status !== 'pending' && task.status !== 'paused') {
      throw new Error('Task cannot be started');
    }

    task.status = 'in-progress';
    task.startedAt = new Date();
    
    this.tasks.set(id, task);

    // Simulate 30-second execution with progress updates
    const totalDuration = 30000; // 30 seconds
    const updateInterval = 500; // Update every 500ms
    const progressIncrement = (updateInterval / totalDuration) * 100;

    const interval = setInterval(() => {
      const currentTask = this.tasks.get(id);
      if (!currentTask || currentTask.status !== 'in-progress') {
        clearInterval(interval);
        this.progressIntervals.delete(id);
        return;
      }

      currentTask.progress = Math.min(currentTask.progress + progressIncrement, 100);
      
      if (currentTask.progress >= 100) {
        currentTask.status = 'completed';
        currentTask.progress = 100;
        currentTask.completedAt = new Date();
        currentTask.result = `Task "${currentTask.title}" completed successfully! Healthcare data processed.`;
        clearInterval(interval);
        this.progressIntervals.delete(id);
      }

      this.tasks.set(id, currentTask);
      onProgress?.(currentTask);
    }, updateInterval);

    this.progressIntervals.set(id, interval);
    
    return task;
  }

  async pauseTask(id: string): Promise<Task> {
    const task = this.tasks.get(id);
    if (!task) throw new Error('Task not found');
    
    if (task.status !== 'in-progress') {
      throw new Error('Task is not running');
    }

    task.status = 'paused';
    
    // Clear the progress interval
    const interval = this.progressIntervals.get(id);
    if (interval) {
      clearInterval(interval);
      this.progressIntervals.delete(id);
    }

    this.tasks.set(id, task);
    return task;
  }

  async resumeTask(id: string, onProgress?: (task: Task) => void): Promise<Task> {
    const task = this.tasks.get(id);
    if (!task) throw new Error('Task not found');
    
    if (task.status !== 'paused') {
      throw new Error('Task is not paused');
    }

    return this.runTask(id, onProgress);
  }

  async cancelTask(id: string): Promise<Task> {
    const task = this.tasks.get(id);
    if (!task) throw new Error('Task not found');
    
    if (task.status === 'completed' || task.status === 'cancelled') {
      throw new Error('Task cannot be cancelled');
    }

    task.status = 'cancelled';
    task.result = 'Task was cancelled by user';
    
    // Clear the progress interval
    const interval = this.progressIntervals.get(id);
    if (interval) {
      clearInterval(interval);
      this.progressIntervals.delete(id);
    }

    this.tasks.set(id, task);
    return task;
  }
}

export const mockApiService = new MockApiService();