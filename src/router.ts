import Router from '@koa/router';

import * as k8s from './k8s';
import { taskStore } from './server';
import { NAMESPACE } from './constants';

const router = new Router();              //Instantiate the router

// Default empty route
router.get('/', (ctx, _next) => {
  ctx.body = taskStore;
});

// check Tasks
router.get('/task/:id', (ctx, _next) => {
  const taskID = ctx.params.id;

  const data = {
    taskID,
    taskMeta: taskStore.registeredTasks[taskID],
    k8sJob: taskStore.k8sJobs[taskID]
  }

  ctx.body = data;
});

function validateTaskRequest(requestBody: Record<string, any>): string | undefined {
  const { projectLink } = requestBody;

  return projectLink ?? projectLink;
}

// Post a new Task
router.post('/task', async(ctx, _next) => {
  console.log(ctx.request);

  // Get repo link from ctx
  const data = ctx.request.body;
  const projectLink = validateTaskRequest(data)
  if (!projectLink) {
    ctx.throw(400, 'Invalid project link', { data });
    return;
  }

  ctx.body = `Check ${projectLink} is under construction...`;
  
  // create a k8s job
  const result = await k8s.createK8sJob(projectLink, NAMESPACE);

  if (result) {
    ctx.status = 200;
    ctx.body = result;
  }
})

router.get('/k8/job', async(ctx, _next) => {
  const jobs = await k8s.getK8sJob(NAMESPACE);
  ctx.body = jobs;
})

export { router }; 

