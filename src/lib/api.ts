import { Document } from "@/types";
import { storage } from "@/lib/storage";

export const api = {
  getDocuments: async (): Promise<Document[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return storage.getDocuments();
  },

  updateDocuments: async (documents: Document[]): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    storage.setDocuments(documents);
  },

  addDocument: async (
    document: Omit<Document, "position">,
  ): Promise<Document> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return storage.addDocument(document);
  },
};
