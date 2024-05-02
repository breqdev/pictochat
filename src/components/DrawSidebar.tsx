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
import { Color, PALETTES } from "./ColorPicker";
import Sidebar from "./Sidebar";
import scrollWav from "../sounds/scroll.wav";

const scrollAudio = new Audio(scrollWav);

export interface ToolState {
  tool: "pencil" | "eraser";
  size: "small" | "large";
}

export type Keyboard =
  | "english"
  | "latin-extended"
  | "hiragana-katakana"
  | "symbols"
  | "emoji";

function Divider() {
  return <hr className="border-2 border-dotted border-gray-700 -mx-1 my-0.5" />;
}

function Toggle({
  active,
  onClick,
  children,
  color,
}: {
  active: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  color: Color;
}) {
  return (
    <button
      className="flex items-center justify-center  h-8 w-8"
      onClick={onClick}
      style={
        active
          ? {
              backgroundColor: PALETTES[color].bg,
              color: PALETTES[color].fg,
            }
          : {
              backgroundColor: "#6B7280",
              color: "#ffffff",
            }
      }
    >
      {children}
    </button>
  );
}

export default function DrawSidebar({
  toolState,
  setToolState,
  setCurrentMessage,
  messages,
  color,
  keyboard,
  setKeyboard,
}: {
  toolState: ToolState;
  setToolState: (toolState: ToolState) => void;
  setCurrentMessage: React.Dispatch<React.SetStateAction<number>>;
  messages: MessageData[];
  color: Color;
  keyboard: Keyboard;
  setKeyboard: (keyboard: Keyboard) => void;
}) {
  return (
    <Sidebar>
      <Toggle
        color={color}
        active={false}
        onClick={() => {
          scrollAudio.play();
          setCurrentMessage((message) => {
            if (message === -1) {
              return messages.length - 2;
            } else if (message <= 0) {
              return 0;
            } else {
              return message - 1;
            }
          });
        }}
      >
        <FontAwesomeIcon icon={faCaretUp} />
      </Toggle>
      <Toggle
        color={color}
        active={false}
        onClick={() => {
          scrollAudio.play();
          setCurrentMessage((message) => {
            if (message === -1) {
              return -1;
            } else if (message + 1 >= messages.length - 1) {
              return -1;
            } else {
              return message + 1;
            }
          });
        }}
      >
        <FontAwesomeIcon icon={faCaretDown} />
      </Toggle>
      <Divider />
      <Toggle
        color={color}
        active={toolState.tool === "pencil"}
        onClick={() => setToolState({ ...toolState, tool: "pencil" })}
      >
        <FontAwesomeIcon icon={faPencilAlt} />
      </Toggle>
      <Toggle
        color={color}
        active={toolState.tool === "eraser"}
        onClick={() => setToolState({ ...toolState, tool: "eraser" })}
      >
        <FontAwesomeIcon icon={faEraser} />
      </Toggle>
      <div className="flex-grow" />
      <Toggle
        color={color}
        active={toolState.size === "large"}
        onClick={() => setToolState({ ...toolState, size: "large" })}
      >
        <FontAwesomeIcon icon={faCircle} />
      </Toggle>
      <Toggle
        color={color}
        active={toolState.size === "small"}
        onClick={() => setToolState({ ...toolState, size: "small" })}
      >
        <FontAwesomeIcon icon={faCircle} className="text-[0.5rem]" />
      </Toggle>
      <Divider />
      <Toggle
        color={color}
        active={keyboard === "english"}
        onClick={() => setKeyboard("english")}
      >
        A/1
      </Toggle>
      <Toggle
        color={color}
        active={keyboard === "latin-extended"}
        onClick={() => setKeyboard("latin-extended")}
      >
        <span className="text-xl">À</span>
      </Toggle>
      <Toggle
        color={color}
        active={keyboard === "hiragana-katakana"}
        onClick={() => setKeyboard("hiragana-katakana")}
      >
        <span className="text-xl">あ</span>
      </Toggle>
      <Toggle
        color={color}
        active={keyboard === "symbols"}
        onClick={() => setKeyboard("symbols")}
      >
        <span className="text-xl">@</span>
      </Toggle>
      <Toggle
        color={color}
        active={keyboard === "emoji"}
        onClick={() => setKeyboard("emoji")}
      >
        <span className="text-xl">☺</span>
      </Toggle>
    </Sidebar>
  );
}
