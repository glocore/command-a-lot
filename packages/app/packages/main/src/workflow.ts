export type WorkflowBlock = {
  task: () => Promise<void>;
};

export type Workflow = WorkflowBlock[];

export async function runWorkflow(workflow: Workflow) {
  const starterPromise = Promise.resolve();
  await workflow.reduce(
    (previousPromise, current) => previousPromise.then(current.task),
    starterPromise
  );
}
