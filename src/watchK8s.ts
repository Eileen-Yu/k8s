import * as k8s from '@kubernetes/client-node';

import { NAMESPACE } from './constants';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

// watch job status
const watch = new k8s.Watch(kc);
// https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/job-v1/#http-request

watch.watch('/apis/batch/v1/namespaces/default/jobs',
  { allowWatchBookmarks: true },
  (phase, apiObj, watchObj) => {
    const job: k8s.V1Job = apiObj;

    if (phase === 'ADDED') {
      console.log('new object:');
    } else if (phase === 'MODIFIED') {
      console.log('changed object:');
    } else if (phase === 'DELETED') {
      console.log('deleted object:');
    } else if (phase === 'BOOKMARK') {
      console.log(`bookmark: ${watchObj.metadata.resourceVersion}`);
    } else {
      console.log('unknown phase: ' + phase);
    }
    console.log(JSON.stringify(job, null, 2));
  },
  err =>  console.error("Watch error:", err))
  .then(_req => {
    // watch returns a request object which you can use to abort the watch.
    // setTimeout(() => req.abort(), 10 * 1000);
  });

const JOB_API = `/apis/batch/v1/namespaces/${NAMESPACE}/jobs`;

export async function watchK8sJob(): Promise<any> {
  const watchHandler = await watch.watch(JOB_API, { allowWatchBookmarks: true },
    (phase, apiObj, watchObj) => {
      const job: k8s.V1Job = apiObj;
  
      if (phase === 'ADDED') {
        console.log('new object:');
      } else if (phase === 'MODIFIED') {
        console.log('changed object:');
      } else if (phase === 'DELETED') {
        console.log('deleted object:');
      } else if (phase === 'BOOKMARK') {
        console.log(`bookmark: ${watchObj.metadata.resourceVersion}`);
      } else {
        console.log('unknown phase: ' + phase);
      }
      console.log(JSON.stringify(job, null, 2));
    },
    err =>  console.error("Watch error:", err));

  return watchHandler;
}

