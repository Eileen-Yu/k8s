import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

console.log(JSON.stringify(kc.contexts, null, 2));

// const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const k8sJobApi = kc.makeApiClient(k8s.BatchV1Api);

export async function createK8sJob(projectLink: string): Promise<boolean> {
  return (!!projectLink);
}

export async function getK8sJob(namespace: string): Promise<k8s.V1JobList> {
 const { body: job } = await k8sJobApi.listNamespacedJob(namespace);
 return job;
}
