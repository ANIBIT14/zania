import { useState } from "react";
import Image from "next/image";
import { thumbnailsOnType } from "@/app/constants/images";

type DocumentCardProps = {
  document: {
    type: string;
    title: string;
    position: number;
  };
  onImageClick: () => void;
};

export default function DocumentCard({
  document,
  onImageClick,
}: DocumentCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  const getThumbnailUrl = (type: string) => {
    return thumbnailsOnType[type];
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer"
      onClick={onImageClick}
    >
      <div className="relative aspect-video">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
        <Image
          src={getThumbnailUrl(document?.type)}
          alt={document.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover rounded"
          onLoad={() => setIsLoading(false)}
          priority
        />
      </div>
      <h3 className="mt-2 text-sm text-gray-500 font-semibold">
        {document?.title}
      </h3>
    </div>
  );
}
