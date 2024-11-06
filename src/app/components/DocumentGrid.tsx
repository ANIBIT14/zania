"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import DocumentCard from "./DocumentCard";
import ImageOverlay from "./ImageOverlay";
import { useDocuments } from "@/hooks/useDocuments";

export default function DocumentGrid() {
  const { documents, updateDocuments, loading, saving, lastSaved, error } =
    useDocuments();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(documents);
    const reorderedItems = [...items];

    const sourceIndex =
      parseInt(result.source.droppableId.split("-")[2]) * 3 +
      result.source.index;
    const destinationIndex =
      parseInt(result.destination.droppableId.split("-")[2]) * 3 +
      result.destination.index;

    const [removed] = reorderedItems.splice(sourceIndex, 1);
    reorderedItems.splice(destinationIndex, 0, removed);

    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      position: index,
    }));

    updateDocuments(updatedItems);
  };

  const handleImageClick = (type: string) => {
    setSelectedImage(type);
  };

  const handleCloseOverlay = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  const sortedDocuments = [...documents].sort(
    (a, b) => a.position - b.position,
  );
  const firstRowDocs = sortedDocuments.slice(0, 3);
  const secondRowDocs = sortedDocuments.slice(3);

  return (
    <div className="container mx-auto p-8">
      {/* Save status indicator */}
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

      <DragDropContext onDragEnd={onDragEnd}>
        {/* First Row */}
        <Droppable droppableId="documents-row-0" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-3 gap-4 mb-4"
            >
              {firstRowDocs.map((doc, index) => (
                <Draggable
                  key={doc.type}
                  draggableId={`${doc.type}-0-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                        cursor: snapshot.isDragging ? "grabbing" : "grab",
                      }}
                    >
                      <div {...provided.dragHandleProps}>
                        <DocumentCard
                          document={doc}
                          onImageClick={() => handleImageClick(doc.type)}
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Second Row */}
        <Droppable droppableId="documents-row-1" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-2 gap-4"
            >
              {secondRowDocs.map((doc, index) => (
                <Draggable
                  key={doc.type}
                  draggableId={`${doc.type}-1-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                        cursor: snapshot.isDragging ? "grabbing" : "grab",
                      }}
                    >
                      <div {...provided.dragHandleProps}>
                        <DocumentCard
                          document={doc}
                          onImageClick={() => handleImageClick(doc.type)}
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {selectedImage && (
        <ImageOverlay imageType={selectedImage} onClose={handleCloseOverlay} />
      )}
    </div>
  );
}
