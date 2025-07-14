import { Task, CreateTaskRequest } from '@/types/task';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  private pollingTasks: Map<string, NodeJS.Timeout> = new Map();

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async createTask(request: CreateTaskRequest): Promise<Task> {
    return this.request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getAllTasks(): Promise<Task[]> {
    return this.request<Task[]>('/api/tasks');
  }

  async getTask(id: string): Promise<Task | null> {
    try {
      return await this.request<Task>(`/api/tasks/${id}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async runTask(id: string): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}/run`, {
      method: 'POST',
    });
  }

  async pauseTask(id: string): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}/pause`, {
      method: 'POST',
    });
  }

  async resumeTask(id: string): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}/resume`, {
      method: 'POST',
    });
  }

  async cancelTask(id: string): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}/cancel`, {
      method: 'POST',
    });
  }

  // Polling method to get real-time updates
  async pollTask(id: string, onUpdate: (task: Task) => void, interval: number = 1000): Promise<void> {
    // Stop any existing polling for this task
    this.stopPolling(id);
    
    const poll = async () => {
      try {
        const task = await this.getTask(id);
        if (task) {
          onUpdate(task);
          
          // Continue polling if task is still running or paused
          if (task.status === 'in-progress' || task.status === 'paused') {
            const timeoutId = setTimeout(poll, interval);
            this.pollingTasks.set(id, timeoutId);
          } else {
            // Task completed or cancelled, stop polling
            this.pollingTasks.delete(id);
          }
        } else {
          // Task not found, stop polling
          this.pollingTasks.delete(id);
        }
      } catch (error) {
        console.error('Error polling task:', error);
        // Continue polling even on error, but with a longer interval
        const timeoutId = setTimeout(poll, interval * 2);
        this.pollingTasks.set(id, timeoutId);
      }
    };
    
    // Start polling immediately
    poll();
  }

  // Method to stop polling for a specific task
  stopPolling(id: string): void {
    const timeoutId = this.pollingTasks.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.pollingTasks.delete(id);
    }
  }

  // Method to stop all polling
  stopAllPolling(): void {
    this.pollingTasks.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    this.pollingTasks.clear();
  }
}

export const apiService = new ApiService(); 