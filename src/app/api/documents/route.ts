import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Document } from "@/types";
import documentsData from "@/data/documents.json";

const databasePath = path.join(process.cwd(), "data", "documents.json");

async function initializeDatabase() {
  try {
    await fs.access(databasePath);
  } catch {
    const initialData = documentsData?.documents;

    await fs.mkdir(path.dirname(databasePath), { recursive: true });
    await fs.writeFile(databasePath, JSON.stringify(initialData, null, 2));
  }
}

async function readDatabase(): Promise<Document[]> {
  await initializeDatabase();
  const data = await fs.readFile(databasePath, "utf8");
  return JSON.parse(data);
}

async function writeDatabase(data: Document[]) {
  await fs.writeFile(databasePath, JSON.stringify(data, null, 2));
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  try {
    await delay(500);
    const documents = await readDatabase();
    return NextResponse.json(documents);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    await delay(500);
    const documents = await request.json();

    if (!Array.isArray(documents)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 },
      );
    }

    await writeDatabase(documents);
    return NextResponse.json(documents);
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update documents" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await delay(500);
    const newDoc = await request.json();

    if (!newDoc.type || !newDoc.title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const currentDocs = await readDatabase();
    newDoc.position = currentDocs.length;
    currentDocs.push(newDoc);

    await writeDatabase(currentDocs);
    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to add document" },
      { status: 500 },
    );
  }
}
