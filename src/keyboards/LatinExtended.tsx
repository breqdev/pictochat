import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLevelDownAlt,
  faLongArrowAltLeft,
} from "@fortawesome/free-solid-svg-icons";
import { ComposeEventDispatcher } from "../components/MessageCompose";
import keypressWav from "../sounds/keypress.wav";

const keypressAudio = new Audio(keypressWav);

const KEYS = [
  ["à", "á", "â", "ä", "è", "é", "ê", "ë", "ì", "í", "î", null],
  ["ï", "ò", "ó", "ô", "ö", "œ", "ù", "ú", "û", "ü", "ç", "Backspace"],
  ["ñ", "ß", "À", "Á", "Â", "Ä", "È", "É", "Ê", "Ë", "Ì", "Enter"],
  ["Í", "Î", "Ï", "Ò", "Ó", "Ô", "Ö", "Œ", "Ù", "Ú", "Û"],
  ["Ü", "Ç", "Ñ", "¡", "¿", "€", "¢", "£", null, null, null, "Space"],
];

export default function LatinExtendedKeyboard({
  dispatch,
}: {
  dispatch: ComposeEventDispatcher;
}) {
  const makeDispatch = React.useCallback(
    (key: string) => () => {
      keypressAudio.play();
      dispatch.current?.({ type: "key", key });
    },
    [dispatch]
  );

  const keyToButton = (key: string | null) => {
    if (key === null) {
      return <span />;
    } else if (key.length === 1) {
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
    } else if (key === "Backspace") {
      return (
        <button
          className="bg-gray-400 text-gray-700 text-2xl h-8"
          onClick={makeDispatch(key)}
          key={key}
        >
          <FontAwesomeIcon icon={faLongArrowAltLeft} />
        </button>
      );
    } else if (key === "Enter") {
      return (
        <button
          className="bg-gray-400 font-bold text-gray-700 h-17 uppercase text-xs row-span-2"
          onClick={makeDispatch("\n")}
          key={key}
        >
          {key}
          <FontAwesomeIcon
            className="transform rotate-90 text-lg"
            icon={faLevelDownAlt}
          />
        </button>
      );
    } else if (key === "Space") {
      return (
        <button
          className="bg-gray-400 font-bold text-gray-700 h-8 uppercase text-xs"
          onClick={makeDispatch(" ")}
          key={key}
        >
          {key}
        </button>
      );
    }
  };

  return (
    <div
      className="bg-white rounded-xl border-black border-2 flex-grow grid gap-0.5 p-1"
      style={{ gridTemplateColumns: "repeat(11, 1fr) 1.6fr" }}
    >
      {KEYS.map((row, i) => row.map((key) => keyToButton(key)))}
    </div>
  );
}
