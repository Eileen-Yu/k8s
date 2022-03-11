import Router from '@koa/router';

import { taskStore } from './server';

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
router.post('/task', (ctx, _next) => {
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
})

export { router }; 

