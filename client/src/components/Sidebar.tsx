import React from "react";

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar(props: SidebarProps) {
  return (
    <div className="flex-shrink-0 bg-white w-10 flex flex-col p-1 gap-1">
      {props.children}
    </div>
  );
}
