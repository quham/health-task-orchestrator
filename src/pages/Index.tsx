import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { useTasks } from '@/hooks/useTasks';
import { Activity } from 'lucide-react';

const Index = () => {
  const { 
    tasks, 
    loading, 
    createTask, 
    runTask, 
    pauseTask, 
    resumeTask, 
    cancelTask 
  } = useTasks();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Healthcare Task Manager</h1>
          </div>
          <p className="text-muted-foreground">
            Manage and execute long-running healthcare operations with real-time monitoring
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TaskForm onSubmit={createTask} loading={loading} />
          </div>
          
          <div className="lg:col-span-2">
            <TaskList
              tasks={tasks}
              onRun={runTask}
              onPause={pauseTask}
              onResume={resumeTask}
              onCancel={cancelTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
