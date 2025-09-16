"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { Sidebar } from "./sidebar";
import { DraggablePanel } from "./draggable-panel";
import type { Panel as ServerPanel } from "@/types/panel";

interface ClientPanel {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isOpen: boolean;
}
import {
  MapIcon,
  MusicalNoteIcon,
  ChatBubbleBottomCenterIcon,
} from "@heroicons/react/24/outline";

const getIconComponent = (
  iconName: string
): React.ComponentType<{ className?: string }> => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    map: MapIcon,
    music: MusicalNoteIcon,
    chat: ChatBubbleBottomCenterIcon,
  };
  return icons[iconName] || MapIcon;
};

interface DynamicDashboardProps {
  initialPanels: ServerPanel[];
}

export default function DynamicDashboard({
  initialPanels,
}: DynamicDashboardProps) {
  const [panels, setPanels] = useState<ClientPanel[]>(() =>
    initialPanels.map((panel) => ({
      ...panel,
      icon: getIconComponent(panel.icon),
    }))
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPanels((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const togglePanel = (id: string) => {
    setPanels((prev) =>
      prev.map((panel) =>
        panel.id === id ? { ...panel, isOpen: !panel.isOpen } : panel
      )
    );
  };

  const closePanel = (id: string) => {
    setPanels((prev) =>
      prev.map((panel) =>
        panel.id === id ? { ...panel, isOpen: false } : panel
      )
    );
  };

  const openPanels = panels.filter((panel) => panel.isOpen);

  return (
    <div className="flex h-full w-full">
      <Sidebar panels={panels} onTogglePanel={togglePanel} />

      <div className="flex-1 flex overflow-hidden">
        {mounted ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
          >
            <SortableContext
              items={openPanels.map((panel) => panel.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex overflow-x-auto scrollbar-hide">
                {openPanels.map((panel) => (
                  <DraggablePanel
                    key={panel.id}
                    panel={panel}
                    onClose={closePanel}
                    totalOpenPanels={openPanels.length}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="flex overflow-x-auto scrollbar-hide">
            {openPanels.map((panel) => (
              <div
                key={panel.id}
                className="min-w-80 flex-1 h-full bg-card border-r border-border flex flex-col"
              >
                <div className="flex items-center justify-between p-4 border-b border-border bg-card">
                  <h2 className="text-lg font-semibold text-card-foreground">
                    {panel.title}
                  </h2>
                  <div className="w-6 h-6 rounded-full hover:bg-muted flex items-center justify-center transition-colors" />
                </div>
                <div className="flex-1 p-4 overflow-y-auto" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
