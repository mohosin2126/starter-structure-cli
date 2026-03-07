export const scriptsTasks = [
  "migrate",
  "seed",
  "verify"
];

export function runScriptsTask(taskName: string) {
  return {
    taskName,
    executedAt: new Date().toISOString()
  };
}
