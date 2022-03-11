export type TaskID = string;

export interface TaskInfo {
  status: string;
}

export interface K8sJobInfo {
  podID: string;
}

export interface TaskStore {
  registeredTasks: Record<TaskID, TaskInfo>;
  k8sJobs: Record<TaskID, K8sJobInfo>;
}
