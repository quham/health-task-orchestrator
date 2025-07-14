export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'paused' | 'completed' | 'cancelled';
  progress: number;
  result?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
}