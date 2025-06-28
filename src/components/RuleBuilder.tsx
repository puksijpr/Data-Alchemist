// src/components/RuleBuilder.tsx
import { useState } from "react";
import { Client, Worker, Task, Rule } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";

interface RuleBuilderProps {
  clients: Client[];
  workers: Worker[];
  tasks: Task[];
  rules: Rule[];
  onAddRule: (rule: Rule) => void;
}

export function RuleBuilder({
  clients,
  workers,
  tasks,
  rules,
  onAddRule,
}: RuleBuilderProps) {
  const [ruleType, setRuleType] = useState<Rule["type"]>("co-run");
  const [config, setConfig] = useState<Record<string, any>>({});
  const [naturalLanguageInput, setNaturalLanguageInput] = useState("");

  const handleAddRule = () => {
    const rule: Rule = {
      id: `rule-${Date.now()}`,
      type: ruleType,
      config,
      description: generateDescription(ruleType, config),
    };
    onAddRule(rule);
    setConfig({});
  };

  const generateDescription = (
    type: Rule["type"],
    config: Record<string, any>
  ): string => {
    switch (type) {
      case "co-run":
        return `Tasks ${config.tasks?.join(", ")} must run together`;
      case "slot-restriction":
        return `${config.group} limited to ${config.minSlots} common slots`;
      case "load-limit":
        return `${config.group} max ${config.maxSlots} slots per phase`;
      case "phase-window":
        return `Task ${config.taskId} allowed in phases ${config.phases}`;
      case "pattern-match":
        return `Pattern rule: ${config.pattern}`;
      case "precedence":
        return `Priority order: ${config.order}`;
      default:
        return "";
    }
  };

  const renderRuleConfig = () => {
    switch (ruleType) {
      case "co-run":
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Select Tasks
              <select
                multiple
                className="mt-1 block w-full rounded-xl border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map(
                    (o) => o.value
                  );
                  setConfig({ ...config, tasks: selected });
                }}
              >
                {tasks.map((task) => (
                  <option key={task.TaskID} value={task.TaskID}>
                    {task.TaskID} - {task.TaskName}
                  </option>
                ))}
              </select>
            </label>
          </div>
        );

      case "slot-restriction":
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Group Type
              <select
                className="mt-1 block w-full rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) =>
                  setConfig({ ...config, groupType: e.target.value })
                }
              >
                <option value="client">Client Group</option>
                <option value="worker">Worker Group</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Group Name
              <input
                type="text"
                className="mt-1 block w-full rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) =>
                  setConfig({ ...config, group: e.target.value })
                }
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Min Common Slots
              <input
                type="number"
                className="mt-1 block w-full rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) =>
                  setConfig({ ...config, minSlots: parseInt(e.target.value) })
                }
              />
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Natural Language Rule Builder */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Natural Language Rule Builder
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="e.g., 'Tasks T1 and T2 must always run together'"
            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            value={naturalLanguageInput}
            onChange={(e) => setNaturalLanguageInput(e.target.value)}
          />
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            onClick={() =>
              console.log("Parse natural language:", naturalLanguageInput)
            }
          >
            Parse
          </button>
        </div>
      </div>

      {/* Manual Rule Builder */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          Manual Rule Builder
        </h3>

        <div className="space-y-6">
          <label className="block text-sm font-medium text-gray-700">
            Rule Type
            <select
              className="mt-1 block w-full rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              value={ruleType}
              onChange={(e) => setRuleType(e.target.value as Rule["type"])}
            >
              <option value="co-run">Co-run</option>
              <option value="slot-restriction">Slot Restriction</option>
              <option value="load-limit">Load Limit</option>
              <option value="phase-window">Phase Window</option>
              <option value="pattern-match">Pattern Match</option>
              <option value="precedence">Precedence</option>
            </select>
          </label>

          {renderRuleConfig()}

          <button
            onClick={handleAddRule}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
          >
            <Plus className="h-4 w-4" />
            Add Rule
          </button>
        </div>
      </div>

      {/* Active Rules Display */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Active Rules
        </h3>
        {rules.length === 0 ? (
          <p className="text-gray-500 text-sm">No rules defined yet.</p>
        ) : (
          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl"
              >
                <span className="text-sm text-gray-700">
                  {rule.description}
                </span>
                <button className="text-red-500 hover:text-red-700 transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
