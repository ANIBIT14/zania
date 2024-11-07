import { useState, useEffect, useCallback } from "react";
import { Document } from "@/types";
import { api } from "@/lib/api";
import { storage } from "@/lib/storage";

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const localData = storage.getDocuments();
        setDocuments(localData);
        setLoading(false);

        const apiData = await api.getDocuments();
        setDocuments(apiData);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load documents",
        );
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const updateDocuments = useCallback((newDocuments: Document[]) => {
    setDocuments(newDocuments);
    storage.setDocuments(newDocuments);
  }, []);

  useEffect(() => {
    let mounted = true;
    const saveDocuments = async () => {
      if (documents.length === 0) return;

      try {
        setSaving(true);
        await api.updateDocuments(documents);
        if (mounted) {
          setLastSaved(new Date());
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to save documents",
          );
        }
      } finally {
        if (mounted) {
          setSaving(false);
        }
      }
    };

    const saveTimeout: NodeJS.Timeout = setTimeout(saveDocuments, 5000);

    return () => {
      mounted = false;
      clearTimeout(saveTimeout);
    };
  }, [documents]);

  const addDocument = useCallback(
    async (newDoc: Omit<Document, "position">) => {
      try {
        const savedDoc = await api.addDocument(newDoc);
        setDocuments((prev) => [...prev, savedDoc]);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add document");
        throw err;
      }
    },
    [],
  );

  return {
    documents,
    updateDocuments,
    addDocument,
    loading,
    saving,
    lastSaved,
    error,
  };
}
