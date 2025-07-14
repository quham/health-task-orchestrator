import { useState, useEffect, useCallback } from 'react';
import { Task, CreateTaskRequest } from '@/types/task';
import { mockApiService } from '@/services/mockApi';
import { useToast } from '@/hooks/use-toast';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadTasks = useCallback(async () => {
    try {
      const allTasks = await mockApiService.getAllTasks();
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
      await mockApiService.createTask(request);
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

  const runTask = useCallback(async (id: string) => {
    try {
      await mockApiService.runTask(id, (updatedTask) => {
        setTasks(prev => prev.map(task => 
          task.id === id ? updatedTask : task
        ));
      });
      await loadTasks();
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
  }, [loadTasks, toast]);

  const pauseTask = useCallback(async (id: string) => {
    try {
      await mockApiService.pauseTask(id);
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
      await mockApiService.resumeTask(id, (updatedTask) => {
        setTasks(prev => prev.map(task => 
          task.id === id ? updatedTask : task
        ));
      });
      await loadTasks();
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
  }, [loadTasks, toast]);

  const cancelTask = useCallback(async (id: string) => {
    try {
      await mockApiService.cancelTask(id);
      await loadTasks();
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