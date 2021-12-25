import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLevelDownAlt,
  faLongArrowAltLeft,
} from "@fortawesome/free-solid-svg-icons";
import { ComposeEventDispatcher } from "./MessageCompose";
import keypressWav from "../sounds/keypress.wav";

const keypressAudio = new Audio(keypressWav);

const KEYS = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "backspace"],
  ["caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter"],
  ["shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
  [";", "`", "space", "[", "]"],
];

const SHIFTED = [
  ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+"],
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "backspace"],
  ["caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", "enter"],
  ["shift", "Z", "X", "C", "V", "B", "N", "M", "<", ">", "?"],
  [":", "~", "space", "{", "}"],
];

const MARGINS = [
  "ml-1 mr-1",
  "ml-8 mr-0",
  "ml-0 mr-0",
  "ml-0 mr-6",
  "ml-[5.5rem] mr-10",
];

export default function Keyboard({
  dispatch,
}: {
  dispatch: ComposeEventDispatcher;
}) {
  const [shifted, setShifted] = React.useState(false);
  const [caps, setCaps] = React.useState(false);

  const makeDispatch = (key: string) => () => {
    keypressAudio.play();
    setShifted(false);
    dispatch.current?.({ type: "key", key });
  };

  const keyToButton = (key: string) => {
    if (key.length === 1) {
      return (
        <button
          className="bg-gray-200 h-8 w-8"
          onClick={makeDispatch(key)}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("text/plain", key);
            e.dataTransfer.effectAllowed = "move";
          }}
          key={key}
        >
          {key}
        </button>
      );
    } else if (key === "shift") {
      return (
        <button
          className={
            "font-bold  h-8 flex-grow uppercase text-sm " +
            (shifted
              ? "bg-blue-300 text-blue-600"
              : "bg-gray-400 text-gray-700")
          }
          onClick={() => {
            keypressAudio.play();
            setShifted(!shifted);
            setCaps(false);
          }}
          key={key}
        >
          {key}
        </button>
      );
    } else if (key === "caps") {
      return (
        <button
          className={
            "font-bold h-8 flex-grow uppercase text-xs " +
            (caps ? "bg-blue-300 text-blue-600" : "bg-gray-400 text-gray-700")
          }
          onClick={() => {
            keypressAudio.play();
            setCaps(!caps);
            setShifted(false);
          }}
          key={key}
        >
          {key}
        </button>
      );
    } else if (key === "backspace") {
      return (
        <button
          className="bg-gray-400 text-gray-700 text-2xl h-8 flex-grow"
          onClick={makeDispatch(key)}
          key={key}
        >
          <FontAwesomeIcon icon={faLongArrowAltLeft} />
        </button>
      );
    } else if (key === "enter") {
      return (
        <button
          className="bg-gray-400 font-bold text-gray-700 h-8 flex-grow uppercase text-xs"
          onClick={makeDispatch("\n")}
          key={key}
        >
          <FontAwesomeIcon
            className="transform rotate-90 scale-y-75 scale-x-125 mr-2 text-xs"
            icon={faLevelDownAlt}
          />
          {key}
        </button>
      );
    } else if (key === "space") {
      return (
        <button
          className="bg-gray-400 font-bold text-gray-700 h-8 flex-grow uppercase text-sm"
          onClick={makeDispatch(" ")}
          key={key}
        >
          {key}
        </button>
      );
    }
  };

  return (
    <div className="bg-white rounded-xl border-black border-2 flex-grow">
      <div className="flex flex-col gap-0.5 py-1 px-0.5">
        {(shifted || caps ? SHIFTED : KEYS).map((row, i) => (
          <div
            className={MARGINS[i] + " flex flex-row gap-0.5 justify-center"}
            key={i}
          >
            {row.map((key) => keyToButton(key))}
          </div>
        ))}
      </div>
    </div>
  );
}
