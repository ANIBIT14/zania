import { NextResponse } from "next/server";
import { Document } from "@/types";
import { getDocuments, updateDocuments } from "@/lib/db";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  try {
    const documents = await getDocuments();
    const formattedDocuments: Document[] = documents.map((doc) => ({
      type: doc.type,
      title: doc.title,
      position: doc.position,
      created_at: doc.created_at,
      updated_at: doc.updated_at,
    }));
    return NextResponse.json(formattedDocuments);
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
    const documents: Document[] = await request.json();

    if (!Array.isArray(documents)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 },
      );
    }

    await updateDocuments(documents);
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
    const newDoc: Document = await request.json();

    if (!newDoc.type || !newDoc.title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const currentDocs = await getDocuments();
    const formattedDocs: Document[] = currentDocs.map((doc) => ({
      type: doc.type,
      title: doc.title,
      position: doc.position,
      created_at: doc.created_at,
      updated_at: doc.updated_at,
    }));
    newDoc.position = formattedDocs.length;
    formattedDocs.push(newDoc);

    await updateDocuments(formattedDocs);
    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to add document" },
      { status: 500 },
    );
  }
}
