// src/lib/validators/clientValidator.ts
import { Client, Task, ValidationError } from "@/lib/type";

export function validateClients(
  clients: Client[],
  tasks: Task[]
): ValidationError[] {
  const errors: ValidationError[] = [];
  const taskIds = new Set(tasks.map((t) => t.TaskID));
  const clientIds = new Set<string>();

  clients.forEach((client, index) => {
    // Check for duplicate IDs
    if (clientIds.has(client.ClientID)) {
      errors.push({
        type: "duplicate-id",
        entity: "client",
        row: index,
        column: "ClientID",
        message: `Duplicate ClientID: ${client.ClientID}`,
        severity: "error",
      });
    }
    clientIds.add(client.ClientID);

    // Validate PriorityLevel
    if (client.PriorityLevel < 1 || client.PriorityLevel > 5) {
      errors.push({
        type: "out-of-range",
        entity: "client",
        row: index,
        column: "PriorityLevel",
        message: `PriorityLevel must be between 1-5, got ${client.PriorityLevel}`,
        severity: "error",
        suggestion: "Set to 3 (medium priority)",
      });
    }

    // Validate RequestedTaskIDs
    const requestedTasks = client.RequestedTaskIDs.split(",").map((id) =>
      id.trim()
    );
    requestedTasks.forEach((taskId) => {
      if (taskId && !taskIds.has(taskId)) {
        errors.push({
          type: "unknown-reference",
          entity: "client",
          row: index,
          column: "RequestedTaskIDs",
          message: `Unknown TaskID: ${taskId}`,
          severity: "error",
          suggestion: `Remove ${taskId} or add it to tasks`,
        });
      }
    });

    // Validate AttributesJSON
    try {
      if (client.AttributesJSON) {
        JSON.parse(client.AttributesJSON);
      }
    } catch {
      errors.push({
        type: "broken-json",
        entity: "client",
        row: index,
        column: "AttributesJSON",
        message: "Invalid JSON in AttributesJSON",
        severity: "error",
        suggestion: "Fix JSON syntax or leave empty",
      });
    }
  });

  return errors;
}
