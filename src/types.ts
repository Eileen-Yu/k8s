interface ProjectInfo {
  projectName: string;
  projectLink: string;
}

export type TaskID = string;

export interface Alert {
  [key: string]: any
}

export interface TaskInfo {
  id: string;
  projectName: string;
  projectLink: string;
  createTime: string;
  finishTime: string;
  status: string;
  result: Alert[];
}

export interface K8sJobInfo {
  podID: string;
}

export interface TaskStore {
  registeredTasks: Record<TaskID, TaskInfo>;
  k8sJobs: Record<TaskID, K8sJobInfo>;
}

export {ProjectInfo}
