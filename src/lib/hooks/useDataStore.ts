// src/hooks/useDataStore.ts
import { useState, useCallback, useEffect } from "react";
import {
  Client,
  Worker,
  Task,
  ValidationError,
  Rule,
  PriorityWeights,
  DataEntity,
} from "@lib/types";
import { validateClients } from "../validators/clientValidators";
import { validateWorkers } from "@/lib/validators/workerValidator";
import { validateTasks } from "@/lib/validators/taskValidator";

export function useDataStore() {
  const [clients, setClients] = useState<Client[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [rules, setRules] = useState<Rule[]>([]);
  const [priorities, setPriorities] = useState<PriorityWeights>({
    priorityLevel: 0.3,
    taskFulfillment: 0.25,
    fairness: 0.2,
    efficiency: 0.15,
    skillMatch: 0.1,
  });

  // Run validation whenever data changes
  useEffect(() => {
    const errors: ValidationError[] = [];

    if (clients.length > 0) {
      errors.push(...validateClients(clients, tasks));
    }

    if (workers.length > 0) {
      errors.push(...validateWorkers(workers, tasks));
    }

    if (tasks.length > 0) {
      errors.push(...validateTasks(tasks, workers));
    }

    setValidationErrors(errors);
  }, [clients, workers, tasks]);

  const setData = useCallback((type: DataEntity, data: any[]) => {
    switch (type) {
      case "clients":
        setClients(data);
        break;
      case "workers":
        setWorkers(data);
        break;
      case "tasks":
        setTasks(data);
        break;
    }
  }, []);

  const updateRow = useCallback(
    (type: DataEntity, index: number, data: any) => {
      switch (type) {
        case "clients":
          setClients((prev) => {
            const updated = [...prev];
            updated[index] = data;
            return updated;
          });
          break;
        case "workers":
          setWorkers((prev) => {
            const updated = [...prev];
            updated[index] = data;
            return updated;
          });
          break;
        case "tasks":
          setTasks((prev) => {
            const updated = [...prev];
            updated[index] = data;
            return updated;
          });
          break;
      }
    },
    []
  );

  const addRule = useCallback((rule: Rule) => {
    setRules((prev) => [...prev, rule]);
  }, []);

  const updatePriorities = useCallback((weights: PriorityWeights) => {
    setPriorities(weights);
  }, []);

  const exportData = useCallback(() => {
    return {
      clients,
      workers,
      tasks,
      rules,
      priorities,
    };
  }, [clients, workers, tasks, rules, priorities]);

  return {
    clients,
    workers,
    tasks,
    validationErrors,
    rules,
    priorities,
    setData,
    updateRow,
    addRule,
    updatePriorities,
    exportData,
  };
}
