import {
  faCaretDown,
  faCaretUp,
  faCircle,
  faEraser,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { MessageData } from "../messages/Message";
import Icon from "./Icon";
import Sidebar from "./Sidebar";

export interface ToolState {
  tool: "pencil" | "eraser";
  size: "small" | "large";
}

function Divider() {
  return <hr className="border-2 border-dotted border-gray-700 -mx-1 my-0.5" />;
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Icon
      backgroundColor={active ? "bg-blue-600" : "bg-gray-400"}
      onClick={onClick}
    >
      {children}
    </Icon>
  );
}

export default function DrawSidebar({
  toolState,
  setToolState,
  setCurrentMessage,
  messages,
}: {
  toolState: ToolState;
  setToolState: (toolState: ToolState) => void;
  setCurrentMessage: React.Dispatch<React.SetStateAction<number>>;
  messages: MessageData[];
}) {
  return (
    <Sidebar>
      <Icon
        backgroundColor="bg-gray-400"
        onClick={() =>
          setCurrentMessage((message) => {
            if (message === -1) {
              return messages.length - 2;
            } else if (message <= 0) {
              return 0;
            } else {
              return message - 1;
            }
          })
        }
      >
        <FontAwesomeIcon icon={faCaretUp} />
      </Icon>
      <Icon
        backgroundColor="bg-gray-400"
        onClick={() =>
          setCurrentMessage((message) => {
            if (message === -1) {
              return -1;
            } else if (message + 1 >= messages.length - 1) {
              return -1;
            } else {
              return message + 1;
            }
          })
        }
      >
        <FontAwesomeIcon icon={faCaretDown} />
      </Icon>
      <Divider />
      <Toggle
        active={toolState.tool === "pencil"}
        onClick={() => setToolState({ ...toolState, tool: "pencil" })}
      >
        <FontAwesomeIcon icon={faPencilAlt} />
      </Toggle>
      <Toggle
        active={toolState.tool === "eraser"}
        onClick={() => setToolState({ ...toolState, tool: "eraser" })}
      >
        <FontAwesomeIcon icon={faEraser} />
      </Toggle>
      <div className="flex-grow" />
      <Toggle
        active={toolState.size === "large"}
        onClick={() => setToolState({ ...toolState, size: "large" })}
      >
        <FontAwesomeIcon icon={faCircle} />
      </Toggle>
      <Toggle
        active={toolState.size === "small"}
        onClick={() => setToolState({ ...toolState, size: "small" })}
      >
        <FontAwesomeIcon icon={faCircle} className="text-[0.5rem]" />
      </Toggle>
      <Divider />
      <Icon backgroundColor="bg-blue-600">A/1</Icon>
      <Icon backgroundColor="bg-gray-400">
        <span className="text-xl">À</span>
      </Icon>
      <Icon backgroundColor="bg-gray-400">
        <span className="text-xl">あ</span>
      </Icon>
      <Icon backgroundColor="bg-gray-400">
        <span className="text-xl">@</span>
      </Icon>
      <Icon backgroundColor="bg-gray-400">
        <span className="text-xl">☺</span>
      </Icon>
    </Sidebar>
  );
}
