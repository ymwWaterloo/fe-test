"use client";

import type React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ClientPanel {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isOpen: boolean;
}

interface DraggablePanelProps {
  panel: ClientPanel;
  onClose: (id: string) => void;
  totalOpenPanels: number;
}

export function DraggablePanel({ panel, onClose }: DraggablePanelProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: panel.id });
  const [panelWidth, setPanelWidth] = useState(320);
  useEffect(() => {
    const calculateWidth = () => {
      const availableWidth = window.innerWidth - 80;
      const calculatedWidth = Math.max(320, Math.floor(availableWidth / 3));
      setPanelWidth(calculatedWidth);
    };

    calculateWidth();
    window.addEventListener("resize", calculateWidth);
    return () => window.removeEventListener("resize", calculateWidth);
  }, []);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose(panel.id);
  };
  const dynamicStyle = {
    ...style,
    width: `${panelWidth}px`,
    minWidth: `${Math.min(320, panelWidth)}px`,
    maxWidth: `${panelWidth}px`,
  };

  return (
    <div
      ref={setNodeRef}
      style={dynamicStyle}
      className={cn(
        "h-full bg-card border-r border-border flex flex-col flex-shrink-0 relative",
        isDragging && "opacity-50 z-50"
      )}
    >
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 w-6 h-6 rounded-full hover:bg-muted flex items-center justify-center transition-colors z-20 bg-background/80 backdrop-blur-sm"
        type="button"
      >
        <XMarkIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" />
      </button>

      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between p-4 pr-10 border-b border-border bg-card cursor-grab active:cursor-grabbing select-none"
      >
        <h2 className="text-lg font-semibold text-card-foreground">
          {panel.title}
        </h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="text-muted-foreground">
          {panel.title} panel content.
        </div>
        <div className="mt-4 space-y-4">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="p-3 bg-muted rounded-lg text-sm">
              Sample {panel.title.toLowerCase()} item {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
