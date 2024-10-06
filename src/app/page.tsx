"use client";

import StarCanvas from "@/components/StarCanvas";
import StarChat from "@/components/StarChat";

export default function StarrySky() {
  return (
    <div className="md:flex block justify-between align-top">
      <StarCanvas />
      <StarChat />
    </div>
  );
}
