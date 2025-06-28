// src/components/NaturalLanguageSearch.tsx
import { useState } from "react";
import { Search } from "lucide-react";
import { Client, Worker, Task } from "@/lib/types";

interface NaturalLanguageSearchProps {
  data: {
    clients: Client[];
    workers: Worker[];
    tasks: Task[];
  };
  onSearch: (results: any[]) => void;
}

export function NaturalLanguageSearch({
  data,
  onSearch,
}: NaturalLanguageSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);

    const lowerQuery = query.toLowerCase();
    let searchResults: any[] = [];

    if (lowerQuery.includes("task") && lowerQuery.includes("duration")) {
      const match = lowerQuery.match(
        /duration\s*(?:of\s*)?(?:more\s*than\s*|>\s*)?(\d+)/
      );
      if (match) {
        const duration = parseInt(match[1]);
        searchResults = data.tasks.filter((t) => t.Duration > duration);
      }
    } else if (lowerQuery.includes("worker") && lowerQuery.includes("skill")) {
      const skillMatch = lowerQuery.match(/skill[s]?\s*["']?(\w+)["']?/);
      if (skillMatch) {
        const skill = skillMatch[1];
        searchResults = data.workers.filter((w) =>
          w.Skills.toLowerCase().includes(skill.toLowerCase())
        );
      }
    } else if (
      lowerQuery.includes("high priority") ||
      lowerQuery.includes("priority")
    ) {
      searchResults = data.clients.filter((c) => c.PriorityLevel >= 4);
    }

    setResults(searchResults);
    onSearch(searchResults);
    setIsSearching(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Natural Language Search
      </h3>

      {/* Input & Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder='e.g., "All tasks with duration more than 2 phases"'
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl shadow hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Results ({results.length})
          </h4>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-h-60 overflow-y-auto text-sm space-y-2">
            {results.map((item, index) => (
              <div
                key={index}
                className="bg-white p-2 rounded border text-gray-700"
              >
                <pre className="whitespace-pre-wrap break-words text-xs">
                  {JSON.stringify(item, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Example Prompts */}
      <div className="mt-6 text-sm text-gray-600">
        <p className="font-semibold mb-1">Example queries:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-500">
          <li>All tasks with duration more than 2 phases</li>
          <li>Workers with skill "python"</li>
          <li>High priority clients</li>
          <li>Tasks that require "data-analysis" skill</li>
        </ul>
      </div>
    </div>
  );
}
