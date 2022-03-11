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

// Post a new Task
router.post('/task', (ctx, _next) => {
  // Get repo link from ctx
  // create a k8s job

})

export { router }; 

