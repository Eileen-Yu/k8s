import { taskStore } from './constants';
import { ProjectInfo, TaskInfo } from './types';

export function createTaskID(projectName: string): string {
  const randomValue = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
  return `${projectName}-${randomValue}`
}

export function createTask({ projectName, projectLink }: ProjectInfo): TaskInfo | false {
  const id = createTaskID(projectName);
  taskStore.registeredTasks[id] = {
    id,
    projectName,
    projectLink,
    createTime: new Date().toString(),
    finishTime: "",
    status: "not started",
    result: [{"A1": "To be read from Falco"}]
  }
  return taskStore.registeredTasks[id];
}
