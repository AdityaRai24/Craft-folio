"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ColorTheme } from "@/lib/colorThemes";

interface CardImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  theme: {
    name: string;
    description: string;
    category: string;
  };
}

const CardImageModal: React.FC<CardImageModalProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  theme,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!sm:max-w-2xl !sm:h-[90vh]">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl font-bold" style={{ color: ColorTheme.textPrimary }}>
            {theme.name}
          </DialogTitle>
          <DialogDescription className="text-base hidden md:block" style={{ color: ColorTheme.textSecondary }}>
            {theme.description}
          </DialogDescription>
        </DialogHeader>
        <div className="relative w-full h-full">
          <div className="relative w-full h-full">
            <img
              src={images[currentIndex]}
              alt={`${theme.name} theme preview`}
              className={`w-full h-full object-contain border border-[${ColorTheme.primary}] bg-black/5`}
            />

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
            >
              <ChevronLeft size={24} color={ColorTheme.primary} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
            >
              <ChevronRight size={24} color={ColorTheme.primary} />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                      ? "bg-primary w-4"
                      : "bg-white/50 hover:bg-white/75"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardImageModal;
