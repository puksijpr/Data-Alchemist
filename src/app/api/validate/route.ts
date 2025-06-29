// src/app/api/validate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateClients } from "@/lib/validators/clientValidators";
import { validateWorkers } from "@/lib/validators/workerValidator";
import { validateTasks } from "@/lib/validators/taskValidator";

export async function POST(request: NextRequest) {
  try {
    const { type, data, allData } = await request.json();
    let errors : string[] = [];

    switch (type) {
      case "clients":
        errors = validateClients(data, allData.tasks || []);
        break;
      case "workers":
        errors = validateWorkers(data, allData.tasks || []);
        break;
      case "tasks":
        errors = validateTasks(data, allData.workers || []);
        break;
    }

    return NextResponse.json({ errors });
  } catch (error) {
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
