import Router from '@koa/router';

import * as k8s from './k8s';
import { taskStore } from './server';
import { TaskInfo } from './types';
import { NAMESPACE } from './constants';

const router = new Router();              //Instantiate the router

// Default empty route
router.get('/task', (ctx, _next) => {
  if (!ctx.querystring) {
    ctx.body = taskStore;
    return;
  }
  const { projectName, projectLink,  }  = ctx.query;

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


interface ProjectInfo {
  projectName: string;
  projectLink: string;
}

function validateTaskRequest(requestBody: Record<string, any>): ProjectInfo | undefined {
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

  // create a k8s job
  const result = await k8s.createK8sJob(projectInfo.projectName, projectInfo.projectLink, NAMESPACE);

  if (result) {
    ctx.status = 200;
    ctx.body = result;
  }
})

router.get('/k8/job', async(ctx, _next) => {
  const jobs = await k8s.getK8sJobs();
  ctx.body = jobs;
})

export { router }; 

