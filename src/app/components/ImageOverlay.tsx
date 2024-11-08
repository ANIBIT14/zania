"use client";
import { useEffect } from "react";
import Image from "next/image";
import { imagesOnType } from "@/app/constants/images";

type ImageOverlayProps = {
  imageType: string;
  onCloseAction: () => void;
};

export default function ImageOverlay({
  imageType,
  onCloseAction,
}: ImageOverlayProps) {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseAction();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [onCloseAction]);

  const getFullImageUrl = (type: string) => {
    return imagesOnType[type];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
        <button
          onClick={onCloseAction}
          className="absolute -top-10 right-0 text-white font-bold text-xl"
        >
          ✕
        </button>
        <div className="relative aspect-video">
          <Image
            src={getFullImageUrl(imageType)}
            alt="Full size document"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
