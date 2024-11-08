import { sql } from "@vercel/postgres";
import { Document } from "@/types";

export async function getDocuments() {
  try {
    const { rows } = await sql`SELECT * FROM documents`;
    return rows;
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    throw new Error("Failed to fetch documents");
  }
}

export async function updateDocuments(documents: Document[]) {
  try {
    for (const document of documents) {
      await sql`
        UPDATE documents
        SET title = ${document.title},
            position = ${document.position},
            updated_at = NOW()
        WHERE type = ${document.type}
      `;
    }
  } catch (error) {
    console.error("Failed to update documents:", error);
    throw new Error("Failed to update documents");
  }
}
