// src/lib/validators/workerValidator.ts
import { Worker, Task, ValidationError } from "@/lib/types";

export function validateWorkers(
  workers: Worker[],
  tasks: Task[]
): ValidationError[] {
  const errors: ValidationError[] = [];
  const workerIds = new Set<string>();
  const allRequiredSkills = new Set<string>();

  tasks.forEach((task) => {
    task.RequiredSkills.split(",").forEach((skill) =>
      allRequiredSkills.add(skill.trim())
    );
  });

  workers.forEach((worker, index) => {
    // Check duplicate IDs
    if (workerIds.has(worker.WorkerID)) {
      errors.push({
        type: "duplicate-id",
        entity: "worker",
        row: index,
        column: "WorkerID",
        message: `Duplicate WorkerID: ${worker.WorkerID}`,
        severity: "error",
      });
    }
    workerIds.add(worker.WorkerID);

    // Validate AvailableSlots
    try {
      const slots = JSON.parse(`[${worker.AvailableSlots}]`);
      if (!Array.isArray(slots) || !slots.every((s) => typeof s === "number")) {
        throw new Error();
      }
    } catch {
      errors.push({
        type: "malformed-list",
        entity: "worker",
        row: index,
        column: "AvailableSlots",
        message: "Invalid AvailableSlots format",
        severity: "error",
        suggestion: "Use format like: 1,3,5",
      });
    }

    // Validate MaxLoadPerPhase
    if (worker.MaxLoadPerPhase < 1) {
      errors.push({
        type: "out-of-range",
        entity: "worker",
        row: index,
        column: "MaxLoadPerPhase",
        message: "MaxLoadPerPhase must be >= 1",
        severity: "error",
      });
    }
  });

  // Check skill coverage
  const workerSkills = new Set<string>();
  workers.forEach((worker) => {
    worker.Skills.split(",").forEach((skill) => workerSkills.add(skill.trim()));
  });

  allRequiredSkills.forEach((skill) => {
    if (!workerSkills.has(skill)) {
      errors.push({
        type: "skill-coverage",
        entity: "worker",
        row: -1,
        column: "Skills",
        message: `No worker has required skill: ${skill}`,
        severity: "error",
        suggestion: `Add ${skill} to at least one worker`,
      });
    }
  });

  return errors;
}
