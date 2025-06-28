// src/lib/validators/taskValidator.ts
import { Task, Worker, ValidationError } from "@/lib/types";

export function validateTasks(
  tasks: Task[],
  workers: Worker[]
): ValidationError[] {
  const errors: ValidationError[] = [];
  const taskIds = new Set<string>();

  tasks.forEach((task, index) => {
    // Check duplicate IDs
    if (taskIds.has(task.TaskID)) {
      errors.push({
        type: "duplicate-id",
        entity: "task",
        row: index,
        column: "TaskID",
        message: `Duplicate TaskID: ${task.TaskID}`,
        severity: "error",
      });
    }
    taskIds.add(task.TaskID);

    // Validate Duration
    if (task.Duration < 1) {
      errors.push({
        type: "out-of-range",
        entity: "task",
        row: index,
        column: "Duration",
        message: "Duration must be >= 1",
        severity: "error",
      });
    }

    // Validate PreferredPhases
    try {
      parsePhaseRange(task.PreferredPhases);
    } catch {
      errors.push({
        type: "malformed-list",
        entity: "task",
        row: index,
        column: "PreferredPhases",
        message: "Invalid PreferredPhases format",
        severity: "error",
        suggestion: "Use format like: 1-3 or 1,3,5",
      });
    }

    // Validate MaxConcurrent
    if (task.MaxConcurrent < 1) {
      errors.push({
        type: "out-of-range",
        entity: "task",
        row: index,
        column: "MaxConcurrent",
        message: "MaxConcurrent must be >= 1",
        severity: "error",
      });
    }
  });

  return errors;
}

function parsePhaseRange(phases: string): number[] {
  const result: number[] = [];
  const parts = phases.split(",");

  parts.forEach((part) => {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map((n) => parseInt(n.trim()));
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
    } else {
      result.push(parseInt(part.trim()));
    }
  });

  return result;
}
