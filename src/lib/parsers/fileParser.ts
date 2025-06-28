// src/lib/parsers/fileParser.ts
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Client, Worker, Task, DataEntity } from "@/lib/types";

const expectedHeaders = {
  clients: [
    "ClientID",
    "ClientName",
    "PriorityLevel",
    "RequestedTaskIDs",
    "GroupTag",
    "AttributesJSON",
  ],
  workers: [
    "WorkerID",
    "WorkerName",
    "Skills",
    "AvailableSlots",
    "MaxLoadPerPhase",
    "WorkerGroup",
    "QualificationLevel",
  ],
  tasks: [
    "TaskID",
    "TaskName",
    "Category",
    "Duration",
    "RequiredSkills",
    "PreferredPhases",
    "MaxConcurrent",
  ],
};

export async function parseFile(file: File, type: DataEntity): Promise<any[]> {
  const extension = file.name.split(".").pop()?.toLowerCase();
  let rawData: any[] = [];

  if (extension === "csv") {
    rawData = await parseCSV(file);
  } else if (extension === "xlsx") {
    rawData = await parseXLSX(file);
  } else {
    throw new Error("Unsupported file format");
  }

  // AI-enhanced header mapping
  return mapHeaders(rawData, type);
}
// src/lib/parsers/fileParser.ts (continued)
async function parseCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
}

async function parseXLSX(file: File): Promise<any[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(worksheet);
}

function mapHeaders(data: any[], type: DataEntity): any[] {
  if (data.length === 0) return [];

  const headers = Object.keys(data[0]);
  const expected = expectedHeaders[type];
  const mapping: Record<string, string> = {};

  // AI-like fuzzy matching for headers
  expected.forEach((expectedHeader) => {
    const match = findBestMatch(expectedHeader, headers);
    if (match) {
      mapping[match] = expectedHeader;
    }
  });

  return data.map((row) => {
    const mappedRow: any = {};
    Object.entries(row).forEach(([key, value]) => {
      const mappedKey = mapping[key] || key;
      mappedRow[mappedKey] = value;
    });
    return mappedRow;
  });
}

function findBestMatch(target: string, candidates: string[]): string | null {
  const targetLower = target.toLowerCase();

  // Exact match
  const exactMatch = candidates.find((c) => c.toLowerCase() === targetLower);
  if (exactMatch) return exactMatch;

  // Contains match
  const containsMatch = candidates.find(
    (c) =>
      c.toLowerCase().includes(targetLower) ||
      targetLower.includes(c.toLowerCase())
  );
  if (containsMatch) return containsMatch;

  // Similarity match
  let bestMatch = "";
  let bestScore = 0;

  candidates.forEach((candidate) => {
    const score = similarity(targetLower, candidate.toLowerCase());
    if (score > bestScore && score > 0.6) {
      bestScore = score;
      bestMatch = candidate;
    }
  });

  return bestMatch || null;
}

function similarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(s1: string, s2: string): number {
  const costs: number[] = [];
  for (let i = 0; i <= s2.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s1.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(j - 1) !== s2.charAt(i - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s1.length] = lastValue;
  }
  return costs[s1.length];
}
