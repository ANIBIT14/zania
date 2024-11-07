import { Document } from "@/types";
import documentsData from "../data/documents.json";

export const storage = {
  getDocuments: (): Document[] => {
    const storedData = localStorage.getItem("documents");
    if (!storedData) {
      localStorage.setItem(
        "documents",
        JSON.stringify(documentsData?.documents),
      );
      return documentsData?.documents;
    }
    return JSON.parse(storedData);
  },

  setDocuments: (documents: Document[]): void => {
    localStorage.setItem("documents", JSON.stringify(documents));
  },

  addDocument: (document: Omit<Document, "position">): Document => {
    const documents = storage.getDocuments();
    const newDocument = {
      ...document,
      position: documents.length,
    };

    documents.push(newDocument);
    storage.setDocuments(documents);
    return newDocument;
  },
};
