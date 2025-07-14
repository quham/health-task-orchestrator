import { Task } from '@/types/task';
import { TaskCard } from './TaskCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListTodo } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onRun: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onCancel: (id: string) => void;
}

export function TaskList({ tasks, onRun, onPause, onResume, onCancel }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No tasks created yet</p>
            <p className="text-sm">Create your first task to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ListTodo className="h-5 w-5" />
        <h2 className="text-xl font-semibold">
          Tasks ({tasks.length})
        </h2>
      </div>
      
      <div className="grid gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onRun={onRun}
            onPause={onPause}
            onResume={onResume}
            onCancel={onCancel}
          />
        ))}
      </div>
    </div>
  );
}