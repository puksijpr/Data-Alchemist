// src/components/ExportButton.tsx
import { Download } from "lucide-react";
import { Client, Worker, Task, Rule, PriorityWeights } from "@/lib/type";
import * as XLSX from "xlsx";

interface ExportButtonProps {
  data: {
    clients: Client[];
    workers: Worker[];
    tasks: Task[];
  };
  rules: Rule[];
  priorities: PriorityWeights;
  onExport: () => void;
}

export function ExportButton({
  data,
  rules,
  priorities,
  onExport,
}: ExportButtonProps) {
  const handleExport = () => {
    const wb = XLSX.utils.book_new();

    const clientsWs = XLSX.utils.json_to_sheet(data.clients);
    const workersWs = XLSX.utils.json_to_sheet(data.workers);
    const tasksWs = XLSX.utils.json_to_sheet(data.tasks);

    XLSX.utils.book_append_sheet(wb, clientsWs, "Clients");
    XLSX.utils.book_append_sheet(wb, workersWs, "Workers");
    XLSX.utils.book_append_sheet(wb, tasksWs, "Tasks");

    XLSX.writeFile(wb, "data-alchemist-export.xlsx");

    const rulesConfig = {
      rules: rules.map((r) => ({
        type: r.type,
        config: r.config,
        description: r.description,
      })),
      priorities,
      metadata: {
        exportDate: new Date().toISOString(),
        version: "1.0.0",
      },
    };

    const rulesBlob = new Blob([JSON.stringify(rulesConfig, null, 2)], {
      type: "application/json",
    });
    const rulesUrl = URL.createObjectURL(rulesBlob);
    const rulesLink = document.createElement("a");
    rulesLink.href = rulesUrl;
    rulesLink.download = "rules.json";
    rulesLink.click();

    onExport();
  };

  const isReadyToExport =
    data.clients.length > 0 || data.workers.length > 0 || data.tasks.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">
        Export Configuration
      </h3>

      <div className="space-y-6">
        {/* Counts Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gray-100 border border-gray-200 rounded-xl p-5 text-center shadow-sm">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Clients</h4>
            <p className="text-3xl font-extrabold text-gray-900">
              {data.clients.length}
            </p>
            <p className="text-xs text-gray-500">records</p>
          </div>
          <div className="bg-gray-100 border border-gray-200 rounded-xl p-5 text-center shadow-sm">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Workers</h4>
            <p className="text-3xl font-extrabold text-gray-900">
              {data.workers.length}
            </p>
            <p className="text-xs text-gray-500">records</p>
          </div>
          <div className="bg-gray-100 border border-gray-200 rounded-xl p-5 text-center shadow-sm">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Tasks</h4>
            <p className="text-3xl font-extrabold text-gray-900">
              {data.tasks.length}
            </p>
            <p className="text-xs text-gray-500">records</p>
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="bg-blue-100 border border-blue-200 rounded-xl p-5 shadow-inner">
          <h4 className="text-sm font-semibold text-blue-800 mb-3">
            Configuration Summary
          </h4>
          <ul className="text-sm text-blue-900 space-y-1 list-disc pl-5">
            <li>{rules.length} business rules defined</li>
            <li>Priority weights configured</li>
            <li>All data validated and cleaned</li>
          </ul>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={!isReadyToExport}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-md hover:from-green-600 hover:to-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-5 w-5" />
          Export Data & Configuration
        </button>

        {/* Description */}
        <p className="text-sm text-center text-gray-500 mt-2">
          This will download cleaned Excel sheets and a{" "}
          <code className="bg-gray-200 px-1 py-0.5 rounded text-xs">
            rules.json
          </code>{" "}
          file
        </p>
      </div>
    </div>
  );
}
