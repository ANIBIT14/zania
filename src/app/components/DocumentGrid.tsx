"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MeasuringStrategy,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arraySwap,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import DocumentCard from "./DocumentCard";
import ImageOverlay from "./ImageOverlay";
import { Document } from "@/types";

export default function DocumentGrid() {
  const [documents, setDocuments] = useState<Document[] | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const initialDocumentsRef = useRef<Document[] | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleImageClick = (type: string) => {
    setSelectedImage(type);
  };

  const handleCloseOverlay = () => {
    setSelectedImage(null);
  };

  const fetchData = async () => {
    try {
      const response = await fetch("/api/documents");
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
        initialDocumentsRef.current = data;
        setLoading(false);
      }
    } catch (error) {
      console.error("GET Error:", error);
    }
  };

  const saveDocuments = useCallback(async () => {
    if (
      !documents ||
      JSON.stringify(documents) === JSON.stringify(initialDocumentsRef.current)
    )
      return;

    try {
      setSaving(true);
      const response = await fetch("/api/documents", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(documents),
      });

      if (response.ok) {
        setLastSaved(new Date());
        initialDocumentsRef.current = documents;
      }
    } catch (error) {
      console.error("PUT Error:", error);
    } finally {
      setSaving(false);
    }
  }, [documents]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(saveDocuments, 5000);
    return () => clearInterval(intervalId);
  }, [documents, saveDocuments]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id?.toString());
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setDocuments((items) => {
        if (!items) return items;
        const activeIndex = items.findIndex((item) => item.type === active.id);
        const overIndex = items.findIndex((item) => item.type === over?.id);
        return arraySwap(items, activeIndex, overIndex);
      });
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const SortableDocumentCard = React.memo(
    ({
      document,
      onImageClick,
    }: {
      document: Document;
      onImageClick: (type: string) => void;
    }) => {
      const { type, title, position } = document;
      const { setNodeRef, listeners, transition, isDragging } = useSortable({
        id: type,
      });

      const style = {
        transition,
        opacity: isDragging ? 0.5 : 1,
      };

      return (
        <div ref={setNodeRef} style={style} {...listeners}>
          <DocumentCard
            key={type}
            document={{ type, title, position }}
            onImageClick={() => {
              onImageClick(type);
            }}
          />
        </div>
      );
    },
  );

  SortableDocumentCard.displayName = "SortableDocumentCard";

  if (loading) {
    return (
      <div className="w-full mx-auto p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      sensors={sensors}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
    >
      <SortableContext
        items={Array.isArray(documents) ? documents.map((doc) => doc.type) : []}
        strategy={rectSortingStrategy}
      >
        <div className="container mx-auto p-8">
          <div className="mb-4">
            {saving && (
              <span className="text-blue-600 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Saving changes...
              </span>
            )}
            {lastSaved && !saving && (
              <span className="text-gray-600">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {Array.isArray(documents) &&
              documents?.length &&
              documents?.map((doc) => (
                <SortableDocumentCard
                  key={doc.type}
                  document={doc}
                  onImageClick={handleImageClick}
                />
              ))}
          </div>

          {selectedImage && (
            <ImageOverlay
              imageType={selectedImage}
              onCloseAction={handleCloseOverlay}
            />
          )}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeId && (
          <DocumentCard
            document={
              documents?.find((doc) => doc.type === activeId) || {
                type: activeId,
                title:
                  documents?.find((doc) => doc.type === activeId)?.title || "",
                position: 0,
              }
            }
            onImageClick={() => {}}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
