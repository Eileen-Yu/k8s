import { V1Job } from "@kubernetes/client-node";

export interface ProjectInfo {
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

export interface TaskStore {
  registeredTasks: Record<TaskID, TaskInfo>;
  k8sJobs: Record<TaskID, V1Job>;
}

