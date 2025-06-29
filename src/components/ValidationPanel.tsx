// src/components/ValidationPanel.tsx
import { ValidationError } from "@/lib/type";
import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";

interface ValidationPanelProps {
  errors: ValidationError[];
}

export function ValidationPanel({ errors }: ValidationPanelProps) {
  const errorCount = errors.filter((e) => e.severity === "error").length;
  const warningCount = errors.filter((e) => e.severity === "warning").length;

  if (errors.length === 0) {
    return (
      <div className="flex items-center gap-3 p-4 border border-green-200 bg-green-50 rounded-xl shadow-sm">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <span className="text-green-800 font-medium text-sm">
          ✅ All validations passed! Your data is clean.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-red-100 border border-red-300 text-red-800 font-medium rounded-lg shadow-sm">
          <AlertCircle className="h-5 w-5 text-red-500" />
          {errorCount} Error{errorCount !== 1 && "s"}
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 border border-yellow-300 text-yellow-800 font-medium rounded-lg shadow-sm">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          {warningCount} Warning{warningCount !== 1 && "s"}
        </div>
      </div>

      {/* Detailed Error/Warning List */}
      <div className="bg-white rounded-2xl shadow border border-gray-200">
        <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
          {errors.map((error, index) => (
            <div
              key={index}
              className={`px-5 py-4 flex items-start gap-4 ${
                error.severity === "error" ? "bg-red-50" : "bg-yellow-50"
              }`}
            >
              {error.severity === "error" ? (
                <AlertCircle className="h-5 w-5 text-red-500 mt-1" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1" />
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  {error.entity.charAt(0).toUpperCase() + error.entity.slice(1)}
                  {error.row >= 0 && ` (Row ${error.row + 1})`}:{" "}
                  <span className="font-normal text-gray-700">
                    {error.message}
                  </span>
                </p>
                {error.suggestion && (
                  <p className="text-sm text-gray-600 mt-1">
                    💡 <span className="italic">{error.suggestion}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
