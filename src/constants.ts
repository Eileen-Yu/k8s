import { TaskStore } from './types';
export const NAMESPACE = 'default';

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
  k8sJobs: { 
    "efg321": {}
  }
};

