import Router from '@koa/router';

import * as k8s from './k8s';
import { taskStore } from './server';
import { TaskInfo } from './types';
import { NAMESPACE } from './constants';
import { ProjectInfo } from './types';
import { createTask } from './task';

const router = new Router();              //Instantiate the router

// Default empty route
router.get('/task', (ctx, _next) => {
  if (!ctx.querystring) {
    ctx.body = taskStore;
    return;
  }

  const { projectName, projectLink }  = ctx.query;

  const allTasks: TaskInfo[] = Object.values(taskStore.registeredTasks);

  const filterByName = projectName ? allTasks.filter(t => t.projectName === projectName) : allTasks;

  const queryResult = projectLink ? filterByName.filter(t => t.projectLink === projectLink) : filterByName;

  ctx.body = queryResult;

});

// check Tasks
router.get('/task/:id', (ctx, _next) => {
  const taskID = ctx.params.id;

  const data = taskStore.registeredTasks[taskID]
  if (!data) {
    ctx.throw(400, 'Invalid task id: ', taskID);
    return;
  }

  ctx.body = data;
});


function validateTaskRequest(requestBody: Record<string, string>): ProjectInfo | undefined {
  const { projectName, projectLink } = requestBody;
  if (!projectName || !projectLink) return undefined;

  return { projectName, projectLink };
}


// Post a new Task
router.post('/task', async(ctx, _next) => {
  console.log(ctx.request);

  // Get repo link from ctx
  const data = ctx.request.body;
  const projectInfo = validateTaskRequest(data);
  if (!projectInfo) {
    ctx.throw(400, 'Invalid project link/name', { data });
    return;
  }
  
  // create a task in taskStore
  const task = createTask(projectInfo);
  if (!task) {
    ctx.throw(500, `Failed to create task for ${JSON.stringify(projectInfo, null, 2)}`);
    return;
  }

  // create a k8s job
  const result = await k8s.createK8sJob(task);
  if (!result) {
    ctx.throw(500, `Failed to create job for task ${task.id}`);
    return;
  }

  ctx.status = 200;
  ctx.body = result;
});

router.get('/k8/job', async(ctx, _next) => {
  const jobs = await k8s.getK8sJobs();
  ctx.body = jobs;
})

export { router }; 

