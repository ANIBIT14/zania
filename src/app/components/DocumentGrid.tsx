"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import DocumentCard from "./DocumentCard";
import ImageOverlay from "./ImageOverlay";
import documentsData from "../../data/documents.json";

type Document = {
  type: string;
  title: string;
  position: number;
};

export default function DocumentGrid() {
  const [documents, setDocuments] = useState<Document[]>(
    documentsData.documents,
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(documents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index,
    }));

    setDocuments(updatedItems);
  };

  const handleImageClick = (type: string) => {
    setSelectedImage(type);
  };

  const handleCloseOverlay = () => {
    setSelectedImage(null);
  };

  return (
    <div className="container mx-auto p-8">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="documents" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-3 gap-4 mb-4"
            >
              {documents.slice(0, 3).map((doc, index) => (
                <Draggable key={doc.type} draggableId={doc.type} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <DocumentCard
                        document={doc}
                        onImageClick={() => handleImageClick(doc.type)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Droppable droppableId="documents-row-2" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-2 gap-4"
            >
              {documents.slice(3).map((doc, index) => (
                <Draggable
                  key={doc.type}
                  draggableId={doc.type}
                  index={index + 3}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <DocumentCard
                        document={doc}
                        onImageClick={() => handleImageClick(doc.type)}
                      />
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
