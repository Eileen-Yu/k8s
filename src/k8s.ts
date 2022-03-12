import * as k8s from '@kubernetes/client-node';
import {NAMESPACE} from './constants';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

console.log(JSON.stringify(kc.contexts, null, 2));

// const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const k8sJobApi = kc.makeApiClient(k8s.BatchV1Api);

export async function createK8sJob(projectName: string, projectLink: string, namespace: string): Promise<k8s.V1Job | undefined> {
  // Todo: add time surfix
  const jobName = projectName + "scanner";

  const job = new k8s.V1Job();

  job.apiVersion = 'batch/v1';
  job.kind = 'Job';

  job.metadata = {
    name: jobName,
    annotations: {
      'packageHunter': 'local',
    },
  };

  job.spec = {
    template: {
      spec: {
        containers: [
          {
            name: "main",
            image: "busybox",
            args: ["/bin/sh", "-c", `git clone ${projectLink}`]
          }
        ],
        restartPolicy: "Never"
      }
    },
    backoffLimit: 0
  };

  console.log(JSON.stringify(job, null, 2));

  try {
    const { body } = await k8sJobApi.createNamespacedJob(namespace, job)
    return body;
  } catch (error) {
    console.error(`Failed to create job:\n${error}`)
    return undefined;
  }
}

// Todo: filter job by annotation
export async function getK8sJobs(): Promise<k8s.V1JobList> {
 const { body: job } = await k8sJobApi.listNamespacedJob(NAMESPACE);
 return job;
}

// Todo: func getK8sJob(id/name): Promise

// Todo: func watchJobStatus(id)
