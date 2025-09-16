import DynamicDashboard from "@/components/dynamic-dashboard";
import type { Panel } from "@/types/panel";

const initialPanels: Panel[] = [
  {
    id: "map",
    title: "Map",
    icon: "map",
    isOpen: true,
  },
  {
    id: "music",
    title: "Music",
    icon: "music",
    isOpen: true,
  },
  {
    id: "chat",
    title: "Chat",
    icon: "chat",
    isOpen: true,
  },
];

export default function Home() {
  return (
    <div className="flex h-screen bg-background">
      <DynamicDashboard initialPanels={initialPanels} />
    </div>
  );
}
