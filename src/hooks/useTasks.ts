import { useState, useEffect, useCallback, useRef } from 'react';
import { Task, CreateTaskRequest } from '@/types/task';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const pollingTasksRef = useRef<Set<string>>(new Set());

  const loadTasks = useCallback(async () => {
    try {
      const allTasks = await apiService.getAllTasks();
      setTasks(allTasks);
    } catch (error) {
      toast.error('Failed to load tasks');
    }
  }, [toast]);

  const createTask = useCallback(async (request: CreateTaskRequest) => {
    try {
      setLoading(true);
      await apiService.createTask(request);
      await loadTasks();
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  }, [loadTasks, toast]);

  const startPolling = useCallback((id: string) => {
    if (pollingTasksRef.current.has(id)) {
      return; // Already polling this task
    }
    
    pollingTasksRef.current.add(id);
    apiService.pollTask(id, (updatedTask) => {
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));
      
      // Remove from polling set if task is completed or cancelled
      if (updatedTask.status === 'completed' || updatedTask.status === 'cancelled') {
        pollingTasksRef.current.delete(id);
      }
    });
  }, []);

  const runTask = useCallback(async (id: string) => {
    try {
      await apiService.runTask(id);
      startPolling(id);
      toast.success('Task execution has begun');
    } catch (error) {
      toast.error('Failed to start task');
    }
  }, [startPolling, toast]);

  const pauseTask = useCallback(async (id: string) => {
    try {
      await apiService.pauseTask(id);
      await loadTasks();
      toast.success('Task execution has been paused');
    } catch (error) {
      toast.error('Failed to pause task');
    }
  }, [loadTasks, toast]);

  const resumeTask = useCallback(async (id: string) => {
    try {
      await apiService.resumeTask(id);
      startPolling(id);
      toast.success('Task execution has been resumed');
    } catch (error) {
      toast.error('Failed to resume task');
    }
  }, [startPolling, toast]);

  const cancelTask = useCallback(async (id: string) => {
    try {
      await apiService.cancelTask(id);
      await loadTasks();
      pollingTasksRef.current.delete(id);
      toast.success('Task has been cancelled');
    } catch (error) {
      toast.error('Failed to cancel task');
    }
  }, [loadTasks, toast]);

  useEffect(() => {
    loadTasks();
    
    // Cleanup polling on unmount
    return () => {
      apiService.stopAllPolling();
    };
  }, [loadTasks]);

  return {
    tasks,
    loading,
    createTask,
    runTask,
    pauseTask,
    resumeTask,
    cancelTask,
    refreshTasks: loadTasks,
  };
}