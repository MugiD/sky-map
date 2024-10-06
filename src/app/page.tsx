'use client'

import StarCanvas from "@/components/StarCanvas";
import StarChat from "@/components/StarChat";
// import ThreeScene from "@/components/ThreeScene";


export default function StarrySky() {


  return (
    <div className="flex justify-between align-top">
      <StarCanvas />
      <StarChat />
    </div>
  );
}
