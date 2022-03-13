import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import { router } from './router';
import { watchK8sJob } from './watchK8s';

const app: Koa = new Koa();              //Instantiate the Koa object
const port: number | string = process.env.PORT || 3000;

watchK8sJob()
  .then(_watchHandler => {})
  .catch(err => console.error(`Error when watching k8s job:\n${err}`));

app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods());           //Use the routes defined using the router

app.listen(port, () => {
  console.log(`Service's listening on port ${port}...`) 
});

