// src/app/page.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { FileUploader } from "@/components/FileUploader";
import { DataGrid } from "@/components/DataGrid";
import { ValidationPanel } from "@/components/ValidationPanel";
import { RuleBuilder } from "@/components/RuleBuilder";
import { PrioritySliders } from "@/components/PrioritySliders";
import { ExportButton } from "@/components/ExportButton";
import { NaturalLanguageSearch } from "@/components/NaturalLanguageSearch";
import { Toaster } from "react-hot-toast";
import { useDataStore } from "@/lib/hooks/useDataStore";

export default function DataAlchemist() {
  const {
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
  } = useDataStore();

  const [activeTab, setActiveTab] = useState("upload");

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <h1 className="text-2xl font-bold">Data Alchemist</h1>
            <span className="text-gray-500">
              AI Resource-Allocation Configurator
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="flex gap-2 bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger
              value="upload"
              className="px-4 py-2 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              1. Upload Data
            </TabsTrigger>
            <TabsTrigger
              value="validate"
              className="px-4 py-2 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              2. Validate & Edit
            </TabsTrigger>
            <TabsTrigger
              value="rules"
              className="px-4 py-2 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              3. Create Rules
            </TabsTrigger>
            <TabsTrigger
              value="prioritize"
              className="px-4 py-2 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              4. Set Priorities
            </TabsTrigger>
            <TabsTrigger
              value="export"
              className="px-4 py-2 rounded data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              5. Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Clients Data</h3>
                <FileUploader
                  fileType="clients"
                  onFileUpload={(data) => setData("clients", data)}
                  hasData={clients.length > 0}
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Workers Data</h3>
                <FileUploader
                  fileType="workers"
                  onFileUpload={(data) => setData("workers", data)}
                  hasData={workers.length > 0}
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Tasks Data</h3>
                <FileUploader
                  fileType="tasks"
                  onFileUpload={(data) => setData("tasks", data)}
                  hasData={tasks.length > 0}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="validate" className="space-y-6">
            <ValidationPanel errors={validationErrors} />

            <div className="space-y-6">
              <NaturalLanguageSearch
                data={{ clients, workers, tasks }}
                onSearch={(results) => console.log(results)}
              />

              {clients.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Clients</h3>
                  <DataGrid
                    data={clients}
                    type="clients"
                    onUpdate={(index, data) =>
                      updateRow("clients", index, data)
                    }
                    errors={validationErrors.filter(
                      (e) => e.entity === "client"
                    )}
                  />
                </div>
              )}

              {workers.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Workers</h3>
                  <DataGrid
                    data={workers}
                    type="workers"
                    onUpdate={(index, data) =>
                      updateRow("workers", index, data)
                    }
                    errors={validationErrors.filter(
                      (e) => e.entity === "worker"
                    )}
                  />
                </div>
              )}

              {tasks.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Tasks</h3>
                  <DataGrid
                    data={tasks}
                    type="tasks"
                    onUpdate={(index, data) => updateRow("tasks", index, data)}
                    errors={validationErrors.filter((e) => e.entity === "task")}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            <RuleBuilder
              clients={clients}
              workers={workers}
              tasks={tasks}
              rules={rules}
              onAddRule={addRule}
            />
          </TabsContent>

          <TabsContent value="prioritize" className="space-y-6">
            <PrioritySliders weights={priorities} onUpdate={updatePriorities} />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <ExportButton
              data={{ clients, workers, tasks }}
              rules={rules}
              priorities={priorities}
              onExport={exportData}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
