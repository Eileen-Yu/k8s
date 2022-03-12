import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { router } from './router';

import { TaskStore } from './types';

export const taskStore: TaskStore = {
  registeredTasks: { 
    "abcd123": { 
      id: "abcd123",
      projectName: "fake1",
      projectLink: "https://github.com/Eileen-Yu/k8s",
      createTime: "3/12/22",
      finishTime: "3/12/22", 
      status: "finished",
      result: [{"alert1": "abc"}, {"alert2": "abcd"}, {"alert3": "abcde"}]
    },
    "efg321":{
      id: "efg321",
      projectName: "realFake2",
      projectLink: "www.hellogugu.com",
      createTime: "3/13/23",
      finishTime: "",
      status: "not started" ,
      result: [{"alert1": 123}, {"alert2": 456}]
    },
  },

  k8sJobs: { "fakejob1": { podID: "asdfasdfasdfasdfasdf" } }
};

const app: Koa = new Koa();              //Instantiate the Koa object
const port: number | string = process.env.PORT || 3000;

app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods());           //Use the routes defined using the router

app.listen(port, () => {
  console.log(`Service's listening on port ${port}...`) 
});

