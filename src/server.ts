import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { router } from './router';

import { TaskStore } from './types';

export const taskStore: TaskStore = {
  registeredTasks: { "fakejob1": { status: "not started" } },
  k8sJobs: { "fakejob1": { podID: "asdfasdfasdfasdfasdf" } }
};

const app: Koa = new Koa();              //Instantiate the Koa object
const port: number | string = process.env.PORT || 3000;

app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods());           //Use the routes defined using the router

app.listen(port, () => {
  console.log(`Service's listening on port ${port}...`) 
});

