import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  Clock,
  CheckCircle,
  XCircle,
  PauseCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onRun: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onCancel: (id: string) => void;
}

export function TaskCard({ task, onRun, onPause, onResume, onCancel }: TaskCardProps) {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <Play className="h-4 w-4" />;
      case 'paused':
        return <PauseCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusVariant = () => {
    switch (task.status) {
      case 'pending':
        return 'secondary' as const;
      case 'in-progress':
        return 'default' as const;
      case 'paused':
        return 'outline' as const;
      case 'completed':
        return 'default' as const;
      case 'cancelled':
        return 'destructive' as const;
    }
  };

  const getStatusText = () => {
    switch (task.status) {
      case 'pending':
        return 'Pending';
      case 'in-progress':
        return 'In Progress';
      case 'paused':
        return 'Paused';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
    }
  };

  const canRun = task.status === 'pending';
  const canPause = task.status === 'in-progress';
  const canResume = task.status === 'paused';
  const canCancel = task.status === 'in-progress' || task.status === 'paused' || task.status === 'pending';

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{task.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Created {format(new Date(task.createdAt), 'MMM d, yyyy HH:mm')}
            </p>
          </div>
          <Badge variant={getStatusVariant()} className="flex items-center gap-1">
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {task.description && (
          <p className="text-sm text-muted-foreground">{task.description}</p>
        )}

        {(task.status === 'in-progress' || task.status === 'paused') && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(task.progress)}%</span>
            </div>
            <Progress value={task.progress} />
          </div>
        )}

        {task.result && (
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm font-medium">Result:</p>
            <p className="text-sm text-muted-foreground mt-1">{task.result}</p>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {canRun && (
            <Button onClick={() => onRun(task.id)} size="sm">
              <Play className="h-4 w-4 mr-1" />
              Run
            </Button>
          )}
          
          {canPause && (
            <Button onClick={() => onPause(task.id)} variant="outline" size="sm">
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </Button>
          )}
          
          {canResume && (
            <Button onClick={() => onResume(task.id)} size="sm">
              <RotateCcw className="h-4 w-4 mr-1" />
              Resume
            </Button>
          )}
          
          {canCancel && (
            <Button onClick={() => onCancel(task.id)} variant="destructive" size="sm">
              <Square className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}