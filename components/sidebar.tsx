"use client";

import type React from "react";
import { cn } from "@/lib/utils";

interface ClientPanel {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isOpen: boolean;
}

interface SidebarProps {
  panels: ClientPanel[];
  onTogglePanel: (id: string) => void;
}

export function Sidebar({ panels, onTogglePanel }: SidebarProps) {
  return (
    <div className="w-20 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 space-y-4">
      {panels.map((panel) => {
        const IconComponent = panel.icon;
        return (
          <button
            key={panel.id}
            onClick={() => onTogglePanel(panel.id)}
            className={cn(
              "w-12 h-12 rounded-lg flex flex-col items-center justify-center transition-all duration-200",
              panel.isOpen
                ? "bg-sidebar-primary text-sidebar-primary-foreground group"
                : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent group"
            )}
          >
            <IconComponent className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{panel.title}</span>
          </button>
        );
      })}
    </div>
  );
}
