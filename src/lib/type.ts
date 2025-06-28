// src/lib/types.ts
export interface Client {
  ClientID: string;
  ClientName: string;
  PriorityLevel: number;
  RequestedTaskIDs: string;
  GroupTag: string;
  AttributesJSON: string;
}

export interface Worker {
  WorkerID: string;
  WorkerName: string;
  Skills: string;
  AvailableSlots: string;
  MaxLoadPerPhase: number;
  WorkerGroup: string;
  QualificationLevel: number;
}

export interface Task {
  TaskID: string;
  TaskName: string;
  Category: string;
  Duration: number;
  RequiredSkills: string;
  PreferredPhases: string;
  MaxConcurrent: number;
}

export interface ValidationError {
  type: string;
  entity: "client" | "worker" | "task";
  row: number;
  column: string;
  message: string;
  severity: "error" | "warning";
  suggestion?: string;
}

export interface Rule {
  id: string;
  type:
    | "co-run"
    | "slot-restriction"
    | "load-limit"
    | "phase-window"
    | "pattern-match"
    | "precedence";
  config: Record<string, any>;
  description: string;
}

export interface PriorityWeights {
  priorityLevel: number;
  taskFulfillment: number;
  fairness: number;
  efficiency: number;
  skillMatch: number;
}

export type DataEntity = "clients" | "workers" | "tasks";
