import React, { ReactNode } from "react";

interface IconProps {
  children: ReactNode;
  borderColor?: string;
  backgroundColor: string;
  onClick?: () => void;
}

export default function Icon(props: IconProps) {
  return (
    <button
      className={
        (props.borderColor ? props.borderColor + " border-2" : "") +
        " " +
        props.backgroundColor +
        " flex items-center justify-center text-white h-8 w-8"
      }
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
