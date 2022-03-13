import * as k8s from '@kubernetes/client-node';

import { NAMESPACE, taskStore } from './constants';

import {deleteK8sJobs} from './k8s';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

// https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/job-v1/#http-request
const JOB_API = `/apis/batch/v1/namespaces/${NAMESPACE}/jobs`;

// watch job status
const watch = new k8s.Watch(kc);

export async function watchK8sJob(): Promise<any> {
  const watchHandler = await watch.watch(JOB_API, { allowWatchBookmarks: true },
    (phase, _apiObj, watchObj) => {
      const job: k8s.V1Job = watchObj.object;
      const name: string = job.metadata!.name!;
      if (!name) return;

      if (phase === 'ADDED') {
        console.log(`new k8s job: ${name}`);
        taskStore.registeredTasks[name].status = "Registered";
      }

      else if (phase === 'MODIFIED') {
        console.log(`Updates on k8s job: ${name}`);

        if (job.status!.succeeded === 1) {
          console.log(`Job ${name} is completed at: ${job.status!.completionTime}`);
          taskStore.registeredTasks[name].status = "Complete";

          // Delete Job once finished
          deleteK8sJobs(name);
        }
        else {
          taskStore.registeredTasks[name].status = "Ongoing";
        }
      }

      else if (phase === 'DELETED') {
        console.log(`Deleted k8s job: ${name}`);
      }
      else if (phase === 'BOOKMARK') {
        console.log(`bookmark: ${watchObj.metadata.resourceVersion}`);
      }
      else {
        console.log('unknown phase: ' + phase);
        console.log(JSON.stringify(watchObj, null, 2));
      }
    },
    err =>  console.error("Watch error:", err));

  return watchHandler;
}

