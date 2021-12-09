import React from "react";

interface ScreenProps {
  children: React.ReactNode;
}

export default function Screen(props: ScreenProps) {
  return (
    <div className="w-[36rem] mx-auto">
      <div className="aspect-w-4 aspect-h-3">
        <div className="flex bg-gray-300 h-full">{props.children}</div>
      </div>
    </div>
  );
}
