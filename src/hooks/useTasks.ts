import { useState, useEffect, useCallback, useRef } from 'react';
import { Task, CreateTaskRequest } from '@/types/task';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const pollingTasksRef = useRef<Set<string>>(new Set());

  const loadTasks = useCallback(async () => {
    try {
      const allTasks = await apiService.getAllTasks();
      setTasks(allTasks);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load tasks',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const createTask = useCallback(async (request: CreateTaskRequest) => {
    try {
      setLoading(true);
      await apiService.createTask(request);
      await loadTasks();
      toast({
        title: 'Success',
        description: 'Task created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      });
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
      toast({
        title: 'Task Started',
        description: 'Task execution has begun',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start task',
        variant: 'destructive',
      });
    }
  }, [startPolling, toast]);

  const pauseTask = useCallback(async (id: string) => {
    try {
      await apiService.pauseTask(id);
      await loadTasks();
      toast({
        title: 'Task Paused',
        description: 'Task execution has been paused',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to pause task',
        variant: 'destructive',
      });
    }
  }, [loadTasks, toast]);

  const resumeTask = useCallback(async (id: string) => {
    try {
      await apiService.resumeTask(id);
      startPolling(id);
      toast({
        title: 'Task Resumed',
        description: 'Task execution has been resumed',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resume task',
        variant: 'destructive',
      });
    }
  }, [startPolling, toast]);

  const cancelTask = useCallback(async (id: string) => {
    try {
      await apiService.cancelTask(id);
      await loadTasks();
      pollingTasksRef.current.delete(id);
      toast({
        title: 'Task Cancelled',
        description: 'Task has been cancelled',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel task',
        variant: 'destructive',
      });
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