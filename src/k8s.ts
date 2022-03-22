import * as k8s from '@kubernetes/client-node';

import { NAMESPACE, taskStore } from './constants';
import { TaskInfo } from './types';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

console.log(JSON.stringify(kc.contexts, null, 2));
 
// const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const k8sJobApi = kc.makeApiClient(k8s.BatchV1Api);

function createK8sJobSpec(task: TaskInfo): k8s.V1Job {
  const { projectName, projectLink, id } = task;

  const job = new k8s.V1Job();

  job.apiVersion = 'batch/v1';
  job.kind = 'Job';

  job.metadata = {
    name: id,
    namespace: NAMESPACE,
    annotations: {
      'packageHunter': 'local',
      'projectName': projectName,
      'projectLink': projectLink,
      'taskID': id
    },
  };

  job.spec = {
    template: {
      spec: {
        containers: [
          {
            name: "main",
            image: "bitnami/git:latest",
            command: ["/bin/bash","-c",`git clone ${projectLink}`],
            volumeMounts: [
              {
                name: 'mypvc',
                mountPath: '/source',
                readOnly: true,
                subPath: 'test/sturdy-eureka'
              }
            ],
          }
        ],
        restartPolicy: "Never"
      }
    },
    backoffLimit: 0
  };

  return job;
}


export async function createK8sJob(task: TaskInfo): Promise<k8s.V1Job | undefined> {
  const jobSpec = createK8sJobSpec(task);

  console.log(JSON.stringify(jobSpec, null, 2));

  try {
    const { body: job } = await k8sJobApi.createNamespacedJob(NAMESPACE, jobSpec);

    const jobName = job.metadata?.name;
    if (!jobName) {
      throw `Error when create k8s job for task:n${task}\n${job}\n`;
    }

    // Update k8s job status to jobStore
    const { body } = await k8sJobApi.readNamespacedJobStatus(jobName, NAMESPACE);
    taskStore.k8sJobs[jobName] = body;

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


export async function deleteK8sJobs(id: string) {
  await k8sJobApi.deleteNamespacedJob(id, NAMESPACE);
}

export async function getK8sJobStatus(id: string): Promise<k8s.V1Job> {
  const { body: jobStatus } = await k8sJobApi.readNamespacedJobStatus(id, NAMESPACE);
  return jobStatus;
}

// Todo: func getK8sJob(id/name): Promise

// Todo: func watchJobStatus(id)
