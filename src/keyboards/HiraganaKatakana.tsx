import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLevelDownAlt,
  faLongArrowAltLeft,
} from "@fortawesome/free-solid-svg-icons";
import { ComposeEventDispatcher } from "../components/MessageCompose";
import keypressWav from "../sounds/keypress.wav";

const keypressAudio = new Audio(keypressWav);

const HIRAGANA = [
  ["あ", "か", "さ", "た", "な", "は", "ま", "や", "ら", "わ", "ー"],
  ["い", "き", "し", "ち", "に", "ひ", "み", "ゆ", "り", "を", "Backspace"],
  ["う", "く", "す", "つ", "ぬ", "ふ", "む", "よ", "る", "ん", "Enter"],
  ["え", "け", "せ", "て", "ね", "へ", "め", "!", "れ", "、"],
  ["お", "こ", "そ", "と", "の", "ほ", "も", "?", "ろ", "。", "Space"],
];

const KATAKANA = [
  ["ア", "カ", "サ", "タ", "ナ", "ハ", "マ", "ヤ", "ラ", "ワ", "ー"],
  ["イ", "キ", "シ", "チ", "ニ", "ヒ", "ミ", "ユ", "リ", "ヲ", "Backspace"],
  ["ウ", "ク", "ス", "ツ", "ヌ", "フ", "ム", "ヨ", "ル", "ン", "Enter"],
  ["エ", "ケ", "セ", "テ", "ネ", "ヘ", "メ", "!", "レ", "、"],
  ["オ", "コ", "ソ", "ト", "ノ", "ホ", "モ", "?", "ロ", "。", "Space"],
];

export default function HiraganaKatakanaKeyboard({
  dispatch,
}: {
  dispatch: ComposeEventDispatcher;
}) {
  const [layout, setLayout] = React.useState<"hiragana" | "katakana">(
    "hiragana"
  );

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
    } else if (key === "ー") {
      return (
        <button
          className="bg-gray-200 h-8"
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

  const keys = layout === "hiragana" ? HIRAGANA : KATAKANA;

  return (
    <div
      className="bg-white rounded-xl border-black border-2 flex-grow grid gap-0.5 p-1"
      style={{ gridTemplateColumns: "1.2fr repeat(10, 1fr) 1.6fr" }}
    >
      <button
        className={
          "font-bold text-gray-700 h-8 text-sm " +
          (layout === "hiragana" ? "bg-green-200" : "bg-gray-400")
        }
        onClick={() => setLayout("hiragana")}
      >
        かな
      </button>
      {keys[0].map((key) => keyToButton(key))}
      <button
        className={
          "font-bold text-gray-700 h-8 text-sm " +
          (layout === "katakana" ? "bg-green-200" : "bg-gray-400")
        }
        onClick={() => setLayout("katakana")}
      >
        カナ
      </button>
      {keys[1].map((key) => keyToButton(key))}
      <button
        className="font-bold text-gray-700 h-8 text-sm bg-gray-400"
        onClick={makeDispatch("゛")}
      >
        ゛
      </button>
      {keys[2].map((key) => keyToButton(key))}
      <button
        className="font-bold text-gray-700 h-8 text-sm bg-gray-400"
        onClick={makeDispatch("゜")}
      >
        ゜
      </button>
      {keys[3].map((key) => keyToButton(key))}
      <button
        className="font-bold text-gray-700 h-8 text-sm bg-gray-400"
        onClick={() => {}}
      >
        小手
      </button>
      {keys[4].map((key) => keyToButton(key))}
    </div>
  );
}
