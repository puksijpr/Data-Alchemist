// src/components/DataGrid.tsx
import { useState, useEffect } from "react";
import { ValidationError } from "@/lib/types";

interface DataGridProps {
  data: any[];
  type: "clients" | "workers" | "tasks";
  onUpdate: (index: number, data: any) => void;
  errors: ValidationError[];
}

export function DataGrid({ data, type, onUpdate, errors }: DataGridProps) {
  const [editingCell, setEditingCell] = useState<{
    row: number;
    col: string;
  } | null>(null);
  const [editValue, setEditValue] = useState("");

  if (data.length === 0) return null;

  const columns = Object.keys(data[0]);

  const getErrorForCell = (row: number, col: string) => {
    return errors.find((e) => e.row === row && e.column === col);
  };

  const handleCellClick = (row: number, col: string) => {
    setEditingCell({ row, col });
    setEditValue(data[row][col]?.toString() || "");
  };

  const handleCellUpdate = () => {
    if (editingCell) {
      const updatedRow = { ...data[editingCell.row] };
      // src/components/DataGrid.tsx (continued)
      // Parse value based on expected type
      let parsedValue: any = editValue;
      if (
        editingCell.col.includes("Level") ||
        editingCell.col.includes("Duration") ||
        editingCell.col.includes("MaxLoadPerPhase") ||
        editingCell.col.includes("MaxConcurrent")
      ) {
        parsedValue = parseInt(editValue) || 0;
      }

      updatedRow[editingCell.col] = parsedValue;
      onUpdate(editingCell.row, updatedRow);
      setEditingCell(null);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 transition duration-200"
            >
              {columns.map((col) => {
                const error = getErrorForCell(rowIndex, col);
                const isEditing =
                  editingCell?.row === rowIndex && editingCell?.col === col;

                return (
                  <td
                    key={col}
                    className={`px-5 py-3 text-sm font-medium ${
                      error
                        ? "bg-red-50 border border-red-300 text-red-600"
                        : "text-gray-800"
                    } cursor-pointer`}
                    onClick={() => handleCellClick(rowIndex, col)}
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellUpdate}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleCellUpdate()
                        }
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        autoFocus
                      />
                    ) : (
                      <div className="relative group">
                        <span>{row[col]}</span>
                        {error && (
                          <div className="absolute z-20 invisible group-hover:visible bg-red-600 text-white text-xs rounded-lg px-3 py-2 shadow-lg bottom-full left-0 mb-2 whitespace-nowrap">
                            {error.message}
                            {error.suggestion && (
                              <div className="text-red-200 mt-1 italic">
                                Suggestion: {error.suggestion}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
