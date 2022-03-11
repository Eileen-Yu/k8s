import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

console.log(JSON.stringify(kc.contexts, null, 2));

// const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const k8sJobApi = kc.makeApiClient(k8s.BatchV1Api);

export async function createK8sJob(projectLink: string, namespace: string): Promise<k8s.V1Job | undefined> {
  const jobName = 'myJob';
  const job = new k8s.V1Job();
  const metadata = new k8s.V1ObjectMeta();
  job.apiVersion = 'batch/v1';
  job.kind = 'Job';
  metadata.name = jobName;
  metadata.annotations = {
    'packageHunter': 'local',
  };
  job.metadata = metadata;

  const spec = new k8s.V1JobSpec();
  spec.template = {
    spec: {
      containers: [
        {
          name: "test",
          image: "busybox",
          command: ["echo", projectLink],
        }
      ]
    }
  };
  spec.backoffLimit = 0;
  job.spec = spec;


  const { body } = await k8sJobApi.createNamespacedJob(namespace, job)

  return body;
}

export async function getK8sJob(namespace: string): Promise<k8s.V1JobList> {
 const { body: job } = await k8sJobApi.listNamespacedJob(namespace);
 return job;
}
